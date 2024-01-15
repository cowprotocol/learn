---
title: Send multiple transactions in a bundle
---

MEV Blocker also allows users to submit bundled transactions that get atomically shared and included in the block.

In this tutorial we are going to submit the two pre-filled transactions and have them included in a bundle.

For this we need to use our injected Web3 provider to get the raw signed transaction data and submit them in a single batched RPC request to the endpoint.

Getting your web3 provider to provide the raw signed transaction data is a bit tricky.
For [security reasons](https://github.com/MetaMask/metamask-extension/issues/3475) Metamask doesn't support `eth_signTransaction`.

We can work around this by creating the raw unsigned transaction data in code and requesting a signature for its hash via the deprecated `eth_sign` method (you may have to enable it in the advanced settings of your Web3 provider).

```typescript
/// file: run.ts
const [firstSignature, secondSignature] = await Promise.all([
	provider.send('eth_sign', [address, utils.keccak256(utils.serializeTransaction(first))]),
	provider.send('eth_sign', [address, utils.keccak256(utils.serializeTransaction(second))])
]);
```

Once the signature request has been confirmed in the popup we can now craft the raw signed transaction data:

```typescript
/// file: run.ts
const firstSigned = utils.serializeTransaction(first, firstSignature);
const secondSigned = utils.serializeTransaction(second, secondSignature);
```

Sending the transactions to the RPC can either be achieved using Ethers `JsonRpcBatchProvider`, which will automatically buffer and batch subsequent calls that are made within 10ms of one another

```typescript
/// file: run.ts
const batchProvider = new providers.JsonRpcBatchProvider('https://rpc.mevblocker.io');
return await Promise.all([
	batchProvider.send('eth_sendRawTransaction', [firstSigned]),
	batchProvider.send('eth_sendRawTransaction', [secondSigned])
]);
```

or via manually crafting the batch payload and sending it to the RPC:

```typescript
/// file: run.ts
const response = await fetch('https://rpc.mevblocker.io/', {
	method: 'POST',
	body: JSON.stringify([
		{
			method: 'eth_sendRawTransaction',
			params: [firstSigned]
		},
		{
			method: 'eth_sendRawTransaction',
			params: [secondSigned]
		}
	]),
	headers: { 'Content-Type': 'application/json' }
});
return await response.json();
```
