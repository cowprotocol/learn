---
title: Basic Usage
---

This tutorial introduces how to use **individual packages** from the CoW Protocol SDK. While the CowSdk provides a unified interface, you can also import and use each package directly from `@cowprotocol/cow-sdk`.

## Core Packages Overview

The CoW Protocol SDK provides several individual packages:

### **📊 OrderBookApi**
Handles order management and quotes:
- **Standalone** - no adapter required
- **Simple initialization** - just needs chainId
- **Independent configuration** - custom rate limits, URLs, etc.

### **📋 MetadataApi**
Generates and processes app data:
- **Requires adapter** for blockchain operations
- **Flexible adapter** - can use different adapters
- **Blockchain aware** - can interact with on-chain data

### **✍️ OrderSigningUtils**
Static utility class for signing orders:
- **No initialization** needed
- **Static methods** - call directly
- **Uses signer** - pass signer to methods

## Basic Setup

Let's try using the packages individually:

```typescript
/// file: run.ts
import type { Web3Provider } from '@ethersproject/providers';
import {
  OrderBookApi,
  MetadataApi,
  SupportedChainId
} from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
  const signer = provider.getSigner();
  const adapter = new EthersV5Adapter({ provider, signer });

  // Initialize packages individually
  const orderBookApi = new OrderBookApi({ chainId });
  const metadataApi = new MetadataApi(adapter);

  // Test OrderBookApi
  const order = await orderBookApi.getOrder(orderUid);

  // Test MetadataApi
  const appDataDoc = await metadataApi.generateAppDataDoc({
    appCode: 'Individual Basic Usage',
    environment: 'production',
    metadata: {
      quote: { slippageBips: 50 },
      orderClass: { orderClass: 'market' }
    }
  });

  return { order, appDataDoc };
}
```

## Package-Specific Configuration

Each package can be configured independently:

```typescript
/// file: run.ts
// OrderBookApi with custom config
const orderBookApi = new OrderBookApi({
  chainId,
  env: 'prod',
  backoffOpts: { maxDelay: 3000, numOfAttempts: 3 },
  baseUrls: {
    [SupportedChainId.GNOSIS_CHAIN]: 'https://api.cow.fi/xdai'
  }
});

// MetadataApi with different adapters
const readOnlyAdapter = new EthersV5Adapter({ provider });
const signingAdapter = new EthersV5Adapter({ provider, signer });

const readOnlyMetadata = new MetadataApi(readOnlyAdapter);
const signingMetadata = new MetadataApi(signingAdapter);
```

## Run the Code

1. Accept the wallet connection request
2. Press the "Run" button
3. Observe the packages working independently

Example output:
```json
/// file: output.json
{
  "orderBook": {
    "uid": "0x8464af...",
    "status": "fulfilled"
  },
  "metadata": {
    "appDataHex": "0xe269b..."
  }
}
```

## What's Next?

Now that you understand the basics of individual packages, the next tutorial will show you how to build a complete trading workflow using these packages together.
