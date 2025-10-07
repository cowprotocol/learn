---
title: Sending Transactions
---

Now that we are connected to MEVBlocker, we can send MEV protected transactions.

Sending transactions works exactly like with any other RPC, using the `eth_sendRawTransaction` method.
Since we are using the injected provider here, we are going to use `signer.sendTransaction` which will create a signature request using your browser's Web3 provider.

### Craft the transaction

For demonstration purposes we are simply going to send 0.01 ETH to ourselves.
For this, we need to craft the transaction object containing our address as `to` and 0.01ETH as `value`:

```typescript
/// file: run.ts
const tx = {
	to: await signer.getAddress(),
	value: utils.parseEther('0.01')
};
```

### Send the transaction

To request signature and submission of the transaction object through your injected web3 provider simply call

```typescript
/// file: run.ts
const transactionResponse = await signer.sendTransaction(tx);
```

You can access and log the pending transaction hash (open the Developer Console to see the logs) via `transactionResponse.hash`.

### Wait for the transaction to be included

It may take a few seconds for the transaction to be confirmed. We can await the response object and once included return the transactions hash

```typescript
/// file: run.ts
await transactionResponse.wait();
return transactionResponse.hash;
```

To view your transaction you can either load it via the MEV Blocker status endpoint (`https://rpc.mevblocker.io/tx/<tx_hash>`) or once mined on Etherscan (`https://etherscan.io/tx/<tx_hash>`)
