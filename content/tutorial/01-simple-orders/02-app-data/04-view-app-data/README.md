---
title: Retrieve by appData hash
---

As with most things in the Order Book API, we can also view the app data that we have uploaded. This is done via the `getAppData` method on the `OrderBookApi` class.

## Instantiate the SDK

Since we're only using the `OrderBookApi` for this tutorial, we don't need to set up the adapter. The `OrderBookApi` works independently without requiring adapter configuration.

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
+++import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';+++

export async function run(provider: Web3Provider): Promise<unknown> {
    const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });
    // ...
}
```

### Retrieving the app data

To retrieve the app data, we use the `getAppData` method on the `OrderBookApi` instance. This method takes the `appDataHash` and returns the app data document.

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(provider: Web3Provider): Promise<unknown> {
    const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });

    // Example app data hash from a previous upload or order
    const appDataHash = '0x462ed5aa08a031342e30dcd1bc374da7ca9be2800ca7a87e43590880aa034554';

    +++const appDataDoc = await orderBookApi.getAppData(appDataHash);+++

    // ...
}
```

### Processing the response

The response from `getAppData` contains a `fullAppData` field which is a stringified JSON object. We can parse this to get the original app data document structure.

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(provider: Web3Provider): Promise<unknown> {
    const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });

    const appDataHash = '0x462ed5aa08a031342e30dcd1bc374da7ca9be2800ca7a87e43590880aa034554';
    const appDataDoc = await orderBookApi.getAppData(appDataHash);

    // Parse the stringified JSON to get the original app data structure
    +++const fullAppData = JSON.parse(appDataDoc.fullAppData);+++

    return fullAppData;
}
```

We can now interpret this using `JSON.parse` and `JSON.stringify` to prettify the output.

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

1. Press the "Run" button
2. Observe the respective data returned to the output panel

An example output should look like:

```json
/// file: output.json
{
	"appCode": "CoW Swap-SafeApp",
	"environment": "production",
	"metadata": {
		"orderClass": {
			"orderClass": "twap"
		},
		"quote": {
			"slippageBips": "7500"
		}
	},
	"version": "0.11.0"
}
```
