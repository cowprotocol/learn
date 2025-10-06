---
title: Getting started
---

Tutorials are designed to be followed in order, as each tutorial builds on the previous one. The tutorial system is built with Web Containers, which means that you can run the code in your browser without having to install anything on your computer.

## Prerequisites

- [Rabby](https://rabby.io/) or [Metamask](https://metamask.io) installed in your browser
- A web browser with WASM support (Chrome, Firefox, Edge, Safari)

> If you are using Brave, you will need to disable shields for the webcontainers to work.

All examples in this tutorial are targeted to work on Gnosis chain.

## Code snippets

All code snippets are in TypeScript, and are executed in a sandboxed environment. You can edit the code and run it again.

Let's look at the current code snippet:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem'

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
  // TODO: Implement
}
```

### Viem Clients

The tutorials allow for the use of a browser's Web3 provider, such as Rabby or Metamask. The tutorial system provides `publicClient` and `walletClient` from the [viem](https://viem.sh) library.

These are automatically injected into the code snippet, and you can use them to interact with the blockchain via your browser's wallet.

### `run` function

Tutorials are very simple plain TypeScript, and the `run` function is the entry point for the code snippet. This function is called when you click the "Run" button.

## Running the code

Let's finish the code snippet by adding some debugging and returning a value:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem'

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
  console.log('Hello world!');

  // Get the chain ID and connected account
  const chainId = await publicClient.getChainId()
  const [account] = await walletClient.getAddresses()

  return {
    message: "Hello world!",
    chainId,
    account
  };
}
```

Once you click the "Run" button, you should see the following output:

```json
/// file: output.json
{
  "message": "Hello world!",
  "chainId": "<your_wallet_chain_id>",
  "account": "<your_wallet_account>"
}
```

> You will see that the console output is not visible. To see this, you must open the browser's developer tools (F12) and select the "Console" tab.
