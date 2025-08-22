---
title: Complete Workflow
---

Now that we understand the CowSdk basics, let's build a complete trading workflow using the unified SDK. We'll create an order in three steps:

1. Generate app data (metadata)
2. Get a quote (pricing)
3. Sign the order (authorization)

## Step 1: Generate App Data

```typescript
/// file: run.ts
const appDataDoc = await cowSdk.metadataApi.generateAppDataDoc({
    appCode: 'Decentralized CoW',
    environment: 'production',
    metadata: {
        referrer: { address: '0xcA771...' },
        quote: { slippageBips: 50 } as latest.Quote,
        orderClass: { orderClass: 'market' } as latest.OrderClass
    }
});

const { appDataHex } = await cowSdk.metadataApi.getAppDataInfo(appDataDoc);
```

## Step 2: Get Quote

```typescript
/// file: run.ts
const { quote } = await cowSdk.orderBook.getQuote({
    sellToken: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', // wxDAI
    buyToken: '0x177127622c4A00F3d409B75571e12cB3c8973d3c', // COW
    from: ownerAddress,
    receiver: ownerAddress,
    sellAmountBeforeFee: '1000000000000000000', // 1 wxDAI
    kind: OrderQuoteSideKindSell.SELL,
    appData: appDataContent,
    appDataHash: appDataHex
});
```

## Step 3: Sign Order

```typescript
/// file: run.ts
const order: UnsignedOrder = {
    ...quote,
    sellAmount: '1000000000000000000',
    feeAmount: '0',
    receiver: ownerAddress,
    appData: appDataHex
};

const orderSigningResult = await cowSdk.orderSigning.signOrder(order, chainId, signer);
```

## Complete Example

```typescript
/// file: run.ts
export async function run(provider: Web3Provider): Promise<unknown> {
  const signer = provider.getSigner();
  const adapter = new EthersV5Adapter({ provider, signer });
  const chainId = SupportedChainId.GNOSIS_CHAIN;

  const cowSdk = new CowSdk({ adapter, chainId, env: 'prod' });

  try {
    // Step 1: App Data
    const appDataDoc = await cowSdk.metadataApi.generateAppDataDoc({...});
    const { appDataHex } = await cowSdk.metadataApi.getAppDataInfo(appDataDoc);

    // Step 2: Quote
    const { quote } = await cowSdk.orderBook.getQuote({...});

    // Step 3: Sign
    const order = { ...quote, appData: appDataHex, ... };
    const signature = await cowSdk.orderSigning.signOrder(order, chainId, signer);

    return {
      appDataHash: appDataHex,
      expectedBuyAmount: quote.buyAmount,
      signature: signature.signature.substring(0, 20) + '...',
      signingScheme: signature.signingScheme
    };
  } catch (error) {
    return { error: error.message };
  }
}
```

## Run the Code

To run the code, press the "Run" button in the bottom right panel.

1. Accept the wallet connection request
2. Press the "Run" button
3. Observe the complete workflow execution

Example output:

```json
/// file: output.json
{
    "appDataHash": "0xe269b...",
    "expectedBuyAmount": "400000000000000000000",
    "signature": "0x98ac...",
    "signingScheme": "eip712"
}
```
