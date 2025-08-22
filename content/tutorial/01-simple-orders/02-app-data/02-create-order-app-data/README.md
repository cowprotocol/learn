---
title: Create order with appData
---

Now, from the previous tutorial we have created a simple app data document. We will now use this document to create an order.

In doing so, we will be making use of:

- [Submit order](/tutorial/submit-order)
- [Simple app data](/tutorial/simple-app-data)

## Instantiate the SDK

We will start from the basic setup from the [submit order](/tutorial/submit-order) tutorial and the [simple app data](/tutorial/simple-app-data) tutorial. This has been populated in the code editor for you.

The key components we'll use are:

- `OrderBookApi` for getting quotes and submitting orders
- `MetadataApi` for creating app data documents (uses the configured adapter automatically)
- `OrderSigningUtils` for signing orders

### Quoting with app data

The keen eye-ed among you will notice that `appDataHex` and `appDataContent` are not used in basic order creation. Let's fix that. When we request a quote, we will pass `appData` and `appDataHash` to the API. This allows the API to:

- validate the app data document and its hash (`appDataHex`)
- wrap the app data into the response object
- determine any additional fees that may be required (if the app data document contains hooks)

```typescript
/// file: run.ts
// After generating the app data document...
export async function run(provider: Web3Provider): Promise<unknown> {
    // Setup adapter first
    const { signer } = setupAdapter(provider)

    // Create app data document
    const { cid, appDataHex, appDataContent } = await metadataApi.getAppDataInfo(appDataDoc)

    const quoteRequest: OrderQuoteRequest = {
        sellToken,
        buyToken,
        from: ownerAddress,
        receiver: ownerAddress,
        sellAmountBeforeFee: sellAmount,
        kind: OrderQuoteSideKindSell.SELL,
        +++appData: appDataContent,+++
        +++appDataHash: appDataHex,+++
    };

    // ...
}
```

### Signing with app data

When signing an order, we need to make sure that we have set the `appData` correctly. In this case, the `UnsignedOrder` used by the `OrderSigningUtils` class has an `appData` field which should be set to the `appDataHex` value.

```typescript
/// file: run.ts
// ...
export async function run(provider: Web3Provider): Promise<unknown> {
    // ...
    const order: UnsignedOrder = {
        ...quote,
        receiver: ownerAddress,
        +++appData: appDataHex,+++
    }

    // OrderSigningUtils automatically uses the configured adapter
    const orderSigningResult = await OrderSigningUtils.signOrder(order, chainId, signer)
    // ...
}
```

### Processing app data

Note that we're using the updated `getAppDataInfo()` method instead of the deprecated `appDataToCid()`. This method returns:

- `cid` - the content identifier for the document
- `appDataHex` - the hash to use in the order's `appData` field
- `appDataContent` - the stringified document content

```typescript
/// file: run.ts
// Use the updated API method
const { cid, appDataHex, appDataContent } = await metadataApi.getAppDataInfo(appDataDoc);
```

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

When running the script, we may be asked to connect a wallet. We can use Rabby for this.

1. Accept the connection request in Rabby
2. Press the "Run" button again
3. Observe the `orderId` returned to the output panel

You can now use the `orderId` to check the status of the order on [CoW Explorer](https://explorer.cow.fi/). Within the order details page, you can also see the app data document that was used to create the order.

### Errors

The usual API errors from the [submit order](/tutorial/submit-order) tutorial may occur. In addition, the following errors may occur:

- **`InvalidAppData`**: The app data passed to the API is not either `bytes32` or a stringified JSON object.
- **`AppDataHashMismatch`**: The hash of the app data document doesn't match the `appDataHash` field provided in the order. This may be due to the app data document being modified after the order was signed.
