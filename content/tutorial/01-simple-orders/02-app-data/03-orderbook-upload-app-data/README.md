---
title: Upload to the API
---

In the last tutorial we showed how to create an order with app data. There are however times when you may want to create an order but you do not have access at that time to the extended app data document, i.e. you only have the **hash** of the `appData`.

A concrete example of this is if you are using a programmatic order, where the `appData` hash is stored in the contract and/or passed back to a watch-tower for execution. In this case, the watch-tower may not have access to the extended app data document, but it does have access to the hash. To allow for this case, we can upload the app data to the Order Book API before the watch-tower relays the order to the Order Book API.

## Instantiate the SDK

We will start from the basic setup from the [quote order](/tutorial/quote-order) tutorial and the [simple app data](/tutorial/simple-app-data) tutorial. This has been populated in the code editor for you.

Both APIs are now available from the umbrella package `@cowprotocol/cow-sdk`:

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
+++import { OrderBookApi, MetadataApi, latest, SupportedChainId, setGlobalAdapter } from '@cowprotocol/cow-sdk';+++
+++import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';+++

// Setup adapter for MetadataApi
function setupAdapter(provider: Web3Provider) {
  const signer = provider.getSigner()
  const adapter = new EthersV5Adapter({ provider, signer })
  setGlobalAdapter(adapter)
  return { signer, adapter }
}

export async function run(provider: Web3Provider): Promise<unknown> {
    setupAdapter(provider) // MetadataApi needs this

    const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });
    const metadataApi = new MetadataApi(); // Uses global adapter automatically
    // ...
}
```

### Uploading the app data

To upload the app data using the Order Book API, we simply use the handy `OrderBookApi` class. This class has a `uploadAppData` method which takes the `appDataHex` and `appDataContent` and returns the confirmed appData hash.

We'll also use the updated `getAppDataInfo()` method to process our app data document:

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
import { OrderBookApi, MetadataApi, latest, SupportedChainId, setGlobalAdapter } from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
    setupAdapter(provider)

    const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });
    const metadataApi = new MetadataApi();

    // Generate app data document
    const appDataDoc = await metadataApi.generateAppDataDoc({
        appCode,
        environment,
        metadata: { referrer, quote: quoteAppDoc, orderClass },
    });

    // Use updated API method
    const { cid, appDataHex, appDataContent } = await metadataApi.getAppDataInfo(appDataDoc);

    +++const fullAppData = await orderBookApi.uploadAppData(appDataHex, appDataContent);+++

    return { fullAppData }
}
```

> Despite the name, `fullAppData` is actually just the **appData hash** that is returned from the API after successful upload.

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

1. Press the "Run" button
2. Observe the respective data returned to the output panel

An example output should look like:

```json
/// file: output.json
{
	"fullAppData": "0xe63428d06deb873ea243dc8fee366c3ef51933770e6c5e121669ed78deaf6a5e"
}
```

Therefore, if we were to sign manually (or via a contract), for the `appData` field we could use `0xe63428d06deb873ea243dc8fee366c3ef51933770e6c5e121669ed78deaf6a5e`.
