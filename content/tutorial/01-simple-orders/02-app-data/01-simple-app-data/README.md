---
title: Simple app data
---

So, we have created a simple order in the previous section, but what if you're a wallet provider, and you want to add some extra data to the order? For example, you may want to associate the order with your app in order to brag about how many orders on CoW Protocol are created by your app.

## Adapter Setup

As we learned in the previous tutorials, to use the CoW Protocol SDK we need to configure an adapter. Since this tutorial uses SDK classes that require the adapter, we've included the setup function that we established in earlier tutorials.

The adapter is configured once and then used automatically by all SDK classes through the global adapter pattern.

## `app-data` SDK

The `app-data` is documented in [JSON Schema](https://docs.cow.fi/cow-protocol/reference/core/intents/app-data#schema). Writing to a schema is not very convenient, so we have a special SDK for that.

### Installation options

The app-data functionality can be used in two ways:

1. **Individual package**: Install `@cowprotocol/app-data` separately
2. **Umbrella package**: Use it from the main `@cowprotocol/cow-sdk` package

In these tutorials, we opt for the **umbrella package approach** for simplicity, importing everything from `@cowprotocol/cow-sdk`:

### Instantiate the SDK

To instantiate the MetadataApi, you have two options:

1. **Pass the adapter directly** in the constructor: `new MetadataApi(adapter)`
2. **Use the global adapter** by calling `setupAdapter()` first, then `new MetadataApi()` without parameters

Since we've already configured the global adapter using `setupAdapter()` in previous tutorials, we can instantiate without passing the adapter:

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
+++import { MetadataApi, latest, setGlobalAdapter } from '@cowprotocol/cow-sdk';+++
+++import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';+++

// Helper function to setup adapter (established in previous tutorials)
function setupAdapter(provider: Web3Provider) {
  const signer = provider.getSigner()
  const adapter = new EthersV5Adapter({ provider, signer })
  setGlobalAdapter(adapter)
  return { signer, adapter }
}

export async function run(provider: Web3Provider): Promise<unknown> {
    setupAdapter(provider)

    // MetadataApi uses the global adapter automatically
    const metadataApi = new MetadataApi();
    // ...
}
```

## `MetadataApi` class

For creating app data documents, we will use the `MetadataApi` class. Since we've set up provider adapters in previous tutorials, the `MetadataApi` will use the configured adapter for any operations that require blockchain interactions.

### App data parameters

As an example, if we were developing a wallet, we may want to add some metadata to the order. In doing so, we will provide:

- `appCode` - the name of our app
- `environment` - the environment we're running on (e.g. `production`, `staging`)
- `referrer` - the ethereum address for the referrer of the order
- `quote` - the quote parameters, nominally the slippage applied to the order
- `orderClass` - the order class, eg. `market`, `limit`, `twap` etc.

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
import { MetadataApi, latest, setGlobalAdapter } from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
	setupAdapter(provider);
	const metadataApi = new MetadataApi();

	const appCode = 'Decentralized CoW';
	const environment = 'production';
	const referrer = { address: '0xcA771eda0c70aA7d053aB1B25004559B918FE662' };

	const quoteAppDoc: latest.Quote = { slippageBips: 50 };
	const orderClass: latest.OrderClass = { orderClass: 'market' };

	// ...
}
```

> We use the `latest` namespace to get the latest types. The schema is versioned, so you may alternatively use the version namespace.

### App data document

Now that we have the parameters, we can create the app data document:

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
import { MetadataApi, latest, setGlobalAdapter } from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
	setupAdapter(provider);
	const metadataApi = new MetadataApi();

	// ...

	const appDataDoc = await metadataApi.generateAppDataDoc({
		appCode,
		environment,
		metadata: {
			referrer,
			quote: quoteAppDoc,
			orderClass
		}
	});

	// ...
}
```

### Processing the document

Now that we have the document, we can process it using the `getAppDataInfo` method. This method will:

- determine the CID of the document
- determine the appDataContent, which is passed in the order's `appData` field when sent to the API
- determine the appDataHex, which is passed in the order's `appDataHash` field when sent to the API

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
import { MetadataApi, latest, setGlobalAdapter } from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
	setupAdapter(provider);
	const metadataApi = new MetadataApi();

	// ...

	const { cid, appDataHex, appDataContent } = await metadataApi.getAppDataInfo(appDataDoc);

	return {
		appDataDoc,
		cid,
		appDataHex,
		appDataContent
	};
}
```

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

1. Press the "Run" button
2. Observe the app data document, hash, and content returned to the output panel

An example output should look like:

```json
/// file: output.json
{
	"appDataDoc": {
		"appCode": "Decentralized CoW",
		"metadata": {
			"referrer": {
				"address": "0xcA771eda0c70aA7d053aB1B25004559B918FE662"
			},
			"quote": {
				"slippageBips": 50
			},
			"orderClass": {
				"orderClass": "market"
			}
		},
		"version": "1.1.0",
		"environment": "production"
	},
	"cid": "f01551b20b4b4561d26cfe084594ddbb4cf6af5397c1bf1cb31997ae4d2a82325eeda8f6d",
	"appDataHex": "0xb4b4561d26cfe084594ddbb4cf6af5397c1bf1cb31997ae4d2a82325eeda8f6d",
	"appDataContent": "{\"appCode\":\"Decentralized CoW\",\"environment\":\"production\",\"metadata\":{\"orderClass\":{\"orderClass\":\"market\"},\"quote\":{\"slippageBips\":50},\"referrer\":{\"address\":\"0xcA771eda0c70aA7d053aB1B25004559B918FE662\"}},\"version\":\"1.1.0\"}"
}
```

Therefore, if we were to sign manually (or via a contract), for the `appData` field we could use the `appDataHex` value returned.
