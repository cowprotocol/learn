---
title: Simple Setup
---

The **CowSdk class** provides a unified interface to access all CoW Protocol functionality through a single SDK instance. Instead of managing multiple separate packages, you get everything you need from one place.

## Why Use CowSdk Class?

The CowSdk class offers several advantages:

- **🎯 Single Entry Point**: One import, one initialization
- **🔧 Consistent Configuration**: Same settings for all modules
- **📦 Batteries Included**: All functionality in one place

## Basic Initialization

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
import { CowSdk, SupportedChainId } from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
	const signer = provider.getSigner();
	const adapter = new EthersV5Adapter({ provider, signer });

	// Initialize the unified SDK
	const cowSdk = new CowSdk({
		adapter,
		chainId: SupportedChainId.GNOSIS_CHAIN,
		env: 'prod' // or 'staging'
	});

	// Now you have access to all modules!
	// ...
}
```

## Available Modules

Once initialized, the CowSdk provides access to core protocol functionality. The available modules depend on your configuration and the current SDK version. For the most up-to-date information about available modules, refer to the [official CoW Protocol documentation](https://docs.cow.fi/).

Each available module is automatically configured with your adapter and chain settings.

## Configuration Options

The CowSdk accepts several configuration options:

```typescript
/// file: run.ts
const cowSdk = new CowSdk({
  adapter,                    // Required: Your provider adapter
  chainId,                   // Required: Target blockchain
  env: 'prod',              // Optional: 'prod' or 'staging' (default: 'prod')
  orderBookOptions: {        // Optional: Advanced order book configuration
    backoffOpts: {...},
    baseUrls: {...}
  }
  ...
})
```

## Using the Modules

Once initialized, you can use any module directly:

```typescript
/// file: run.ts
// Get an order using the unified approach
const order = await cowSdk.orderBook.getOrder(orderUid)

// Generate app data
const appData = await cowSdk.metadataApi.generateAppDataDoc({...})

// Sign an order using the unified SDK
const signature = await cowSdk.orderSigning.signOrder(order, chainId, signer)
```

## Run the Code

1. Accept the wallet connection request
2. Press the "Run" button
3. Observe the SDK initialization

Example output:

```json
{
	"cowSdkInitialized": true,
	"availableModules": {
		"orderBook": true,
		"metadataApi": true,
		"orderSigning": true,
		"subgraph": true
	}
}
```
