---
title: Cancelling on-chain
---

The preferred way to cancel an order is off-chain, notably because it is free. However, this places trust in the API to cancel the order. If you want to enforce the cancellation of an order, you can do so on-chain. This will cost gas, but will ensure that the order is cancelled.

The on-chain cancellation sends an `invalidateOrder` transaction to the [`GPv2Settlement`](https://docs.cow.fi/cow-protocol/reference/contracts/core/settlement) or [`EthFlow`](https://docs.cow.fi/cow-protocol/reference/contracts/periphery/eth-flow) contract.

## Cancelling the order on-chain

The TradingSdk provides the `onChainCancelOrder` method that handles the contract interaction, encoding the transaction, and sending it. We simply need to provide the `orderUid`:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, TradingSdk } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(
    setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
const { publicClient, walletClient } = await setup(SupportedChainId.GNOSIS_CHAIN)
	// ...

	const orderUid = '0x8464affce2df48b60f6976e51414dbc079e9c30ef64f4c1f78c7abe2c7f96a0c29104bb91ada737a89393c78335e48ff4708727e659523a1';

	try {
		const txHash = await sdk.onChainCancelOrder({ orderUid });

		return {
			txHash,
			explorerLink: `https://gnosisscan.io/tx/${txHash}`,
			message: 'Order cancelled on-chain successfully'
		};
	} catch (e) {
		return e;
	}
}
```

The `onChainCancelOrder` method:

- Fetches the order details from the API
- Determines if it's an EthFlow order or a regular order
- Sends the appropriate cancellation transaction to the Settlement or EthFlow contract
- Returns the transaction hash

Just as we did in previous tutorials, we are using a `try/catch` block to handle errors.

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

> Important! Enter an open order `orderUid` that belongs to the currently connected wallet, otherwise the transaction will revert!

When running the script, we may be asked to connect a wallet. We can use Rabby for this.

1. Accept the connection request in Rabby
2. Press the "Run" button again
3. Confirm the transaction in your wallet (this will cost gas)
4. Observe the transaction hash and explorer link returned to the output panel

A successful on-chain cancellation should look like:

```json
/// file: output.json
{
	"txHash": "0x...",
	"explorerLink": "https://gnosisscan.io/tx/0x...",
	"message": "Order cancelled on-chain successfully"
}
```

> The `onChainCancelOrder` method returns the transaction hash. You can click the `explorerLink` to view the transaction on GnosisScan.

**Note:** On-chain cancellation requires paying gas fees, unlike off-chain cancellation which is free.
