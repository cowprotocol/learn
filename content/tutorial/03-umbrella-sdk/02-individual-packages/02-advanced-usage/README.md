---
title: Advanced Usage
---

Now that you understand the basics of individual packages, let's build a complete trading workflow. We'll use all three core packages together to create, quote, and sign an order.

## The Trading Workflow

We'll build the workflow in three steps:

1. Generate app data with `MetadataApi`
2. Get a quote with `OrderBookApi`
3. Sign the order with `OrderSigningUtils`

## Step 1: Generate App Data

First, we use `MetadataApi` to create order metadata:

```typescript
/// file: run.ts
import {
  OrderBookApi,
  MetadataApi,
  OrderSigningUtils,
  SupportedChainId,
  OrderQuoteSideKindSell,
  UnsignedOrder
} from '@cowprotocol/cow-sdk';

export async function run(provider: Web3Provider): Promise<unknown> {
  const signer = provider.getSigner();
  const adapter = new EthersV5Adapter({ provider, signer });

  // Initialize packages
  const metadataApi = new MetadataApi(adapter);

  // Generate app data
  const appDataDoc = await metadataApi.generateAppDataDoc({
    appCode: 'Individual Packages Tutorial',
    environment: 'production',
    metadata: {
      referrer: { address: '0xcA771...' },
      quote: { slippageBips: 50 },
      orderClass: { orderClass: 'market' }
    }
  });

  const { appDataHex, appDataContent } = await metadataApi.getAppDataInfo(appDataDoc);
  // ...
}
```

## Step 2: Get Quote

Next, we use `OrderBookApi` to get pricing information:

```typescript
/// file: run.ts
// Initialize OrderBookApi (no adapter needed)
const orderBookApi = new OrderBookApi({ chainId });

// Get quote
const { quote } = await orderBookApi.getQuote({
  sellToken: '0xe91d...', // wxDAI
  buyToken: '0x177...', // COW
  from: ownerAddress,
  receiver: ownerAddress,
  sellAmountBeforeFee: '1000000000000000000', // 1 wxDAI
  kind: OrderQuoteSideKindSell.SELL,
  appData: appDataContent,
  appDataHash: appDataHex
});
```

## Step 3: Sign Order

Finally, we use `OrderSigningUtils` to sign the order:

```typescript
/// file: run.ts
// Prepare order for signing
const order: UnsignedOrder = {
  ...quote,
  sellAmount: '1000000000000000000',
  feeAmount: '0',
  receiver: ownerAddress,
  appData: appDataHex
};

// Sign using static method
const signature = await OrderSigningUtils.signOrder(order, chainId, signer);
```

## Complete Example

Here's the complete workflow putting it all together:

```typescript
/// file: run.ts
export async function run(provider: Web3Provider): Promise<unknown> {
  const signer = provider.getSigner();
  const adapter = new EthersV5Adapter({ provider, signer });

  // Initialize packages
  const orderBookApi = new OrderBookApi({ chainId });
  const metadataApi = new MetadataApi(adapter);

  try {
    // Step 1: App Data
    const appDataDoc = await metadataApi.generateAppDataDoc({...});
    const { appDataHex } = await metadataApi.getAppDataInfo(appDataDoc);

    // Step 2: Quote
    const { quote } = await orderBookApi.getQuote({...});

    // Step 3: Sign
    const order = { ...quote, appData: appDataHex, ... };
    const signature = await OrderSigningUtils.signOrder(order, chainId, signer);

    return {
      appData: { appDataHex: appDataHex.substring(0, 10) + '...' },
      quote: {
        sellAmount: quote.sellAmount,
        buyAmount: quote.buyAmount
      },
      signature: {
        value: signature.signature.substring(0, 10) + '...',
        scheme: signature.signingScheme
      }
    };
  } catch (error) {
    return { error: error.message };
  }
}
```

## Run the Code

1. Accept the wallet connection request
2. Press the "Run" button
3. Observe the complete workflow execution

Example output:
```json
/// file: output.json
{
  "appData": {
    "appDataHex": "0xe269b..."
  },
  "quote": {
    "sellAmount": "1000000000000000000",
    "buyAmount": "400000000000000000000"
  },
  "signature": {
    "value": "0x98ac1...",
    "scheme": "eip712"
  }
}
```
