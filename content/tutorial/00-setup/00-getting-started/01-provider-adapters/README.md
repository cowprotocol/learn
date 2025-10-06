---
title: Provider Adapters
---

The CoW Protocol SDK is designed to work with multiple Ethereum libraries through a **provider adapter system**. This approach allows you to use the same SDK API regardless of whether you prefer Ethers v5, Ethers v6, or Viem.

## What are Provider Adapters?

Provider adapters are wrapper classes that provide a unified interface to different Ethereum libraries. They handle the differences between libraries so you don't have to worry about implementation details.

**Supported adapters:**
- ✅ **EthersV5Adapter** - For Ethers v5 (used in these tutorials)
- ✅ **EthersV6Adapter** - For Ethers v6 
- ✅ **ViemAdapter** - For Viem

## Adapter Examples

While these tutorials use **Ethers v5**, here's how you would initialize each adapter:

### EthersV5 Adapter
```typescript
/// file: run.ts
import { setGlobalAdapter } from '@cowprotocol/cow-sdk'
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter'
import { ethers } from 'ethers'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const adapter = new EthersV5Adapter({ provider, signer })

setGlobalAdapter(adapter)
```

### EthersV6 Adapter  
```typescript
/// file: run.ts
import { setGlobalAdapter } from '@cowprotocol/cow-sdk'
import { EthersV6Adapter } from '@cowprotocol/sdk-ethers-v6-adapter'
import { ethers } from 'ethers' // v6

const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()
const adapter = new EthersV6Adapter({ provider, signer })

setGlobalAdapter(adapter)
```

### Viem Adapter
```typescript
/// file: run.ts
import { setGlobalAdapter } from '@cowprotocol/cow-sdk'
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
})
const adapter = new ViemAdapter({ walletClient })

setGlobalAdapter(adapter)
```

> **Note:** Future tutorials will cover EthersV6 and Viem adapters in detail. For now, we focus on EthersV5.

## Why Do We Need Adapters?

Different Ethereum libraries have different APIs:

```typescript
/// file: run.ts
// Ethers v5
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

// Ethers v6  
const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()

// Viem
const walletClient = createWalletClient({
  transport: custom(window.ethereum)
})
```

Adapters abstract these differences, allowing the SDK to work consistently with any library.

## Global Adapter Configuration

When you use the **umbrella package** (`@cowprotocol/cow-sdk`), the SDK uses a **global adapter** pattern:

1. **Configure once** with `setGlobalAdapter()`  
2. **All SDK classes use it automatically**

This means you set up your preferred Ethereum library once, and all SDK components (`OrderBookApi`, `MetadataApi`, etc.) automatically use it internally.

## EthersV5 Setup

For these tutorials, we'll use **Ethers v5**:

```typescript
/// file: run.ts
import { setGlobalAdapter } from '@cowprotocol/cow-sdk'
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter'

// Create adapter with your provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const adapter = new EthersV5Adapter({ provider, signer })

// Set as global adapter (do this once in your app)
setGlobalAdapter(adapter)

// Now all SDK classes from @cowprotocol/cow-sdk use this adapter automatically:
// const orderBookApi = new OrderBookApi({ chainId }) // ✅ Uses the adapter
// const metadataApi = new MetadataApi() // ✅ Uses the adapter  
```

## Updating the Signer

If you need to change the signer (e.g., user switches accounts), you can update it:

```typescript
/// file: run.ts
// Update signer without recreating the adapter
const newSigner = provider.getSigner()
adapter.setSigner(newSigner)

// The adapter now uses the new signer for all operations
```

## Testing the Setup

Let's test the adapter configuration by:

1. Creating an EthersV5Adapter
2. Setting it as the global adapter  
3. Verifying it works correctly

The adapter handles blockchain operations like getting chain ID, addresses, and signing - all the low-level details you need for trading on CoW Protocol.

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

When running the script, we may be asked to connect a wallet. We can use Rabby for this.

1. Accept the connection request in Rabby
2. Press the "Run" button again
3. Observe the adapter information returned to the output panel

An example output should look like:

```json
/// file: output.json
{
    "adapterType": "EthersV5Adapter",
    "chainId": 100,
    "address": "0x...",
    "message": "Adapter configured successfully!"
}
```

## What's Next?

With adapters configured, you can now use any CoW Protocol SDK component. They'll all automatically use your configured adapter for blockchain interactions.
