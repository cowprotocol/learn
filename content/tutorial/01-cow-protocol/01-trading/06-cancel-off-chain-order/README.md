---
title: Cancelling off-chain
---

In the last tutorial, we submitted an order to CoW Protocol. In this tutorial, we will attempt to cancel the order we just submitted.

## Off-chain cancellation

One of the many advantages of CoW Protocol and the use of intents is that we can cancel orders for free, off-chain. This means that we do not need to pay any gas fees to cancel an order.

To cancel an order, we need to know the `orderUid` of the order we want to cancel. This is the unique identifier you received in the last tutorial.

### Cancelling the order

The `TradingSdk` provides a convenient `offChainCancelOrder` method that handles signing and sending the cancellation in one step. We simply need to provide the `orderUid`:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, TradingSdk } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

import { SupportedChainId } from "@cowprotocol/cow-sdk"

export async function run(
    setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
const { publicClient, walletClient } = await setup(SupportedChainId.GNOSIS_CHAIN)
	// ...

  // Put an open order uid, otherwise you will see `OrderFullyExecuted` as a result
	const orderUid =
		'0x8464affce2df48b60f6976e51414dbc079e9c30ef64f4c1f78c7abe2c7f96a0c29104bb91ada737a89393c78335e48ff4708727e659523a1';

	try {
		const cancellationResult = await sdk.offChainCancelOrder({ orderUid });

		return {
			success: cancellationResult,
			message: 'Order cancelled successfully'
		};
	} catch (e) {
		return e;
	}
}
```

The `offChainCancelOrder` method:

- Signs the cancellation using the wallet
- Sends the cancellation to the CoW Protocol API
- Returns `true` if the cancellation is successful

Just as we did in the [submit order tutorial](/tutorial/submit-order), we are using a `try/catch` block to handle errors.

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

When running the script, we may be asked to connect a wallet. We can use Rabby for this.

1. Accept the connection request in Rabby
2. Press the "Run" button again
3. Sign the cancellation when prompted by your wallet
4. Observe the cancellation result returned to the output panel

A successful cancellation should look like:

```json
/// file: output.json
{
	"success": true,
	"message": "Order cancelled successfully"
}
```

> The `offChainCancelOrder` method returns `true` if the cancellation is successful.

### Errors

A couple of errors may easily result when running this code:

- **`OrderFullyExecuted`**: The order you are trying to cancel has already been fully executed. This means that the order has been fully filled and the funds have been transferred to the `receiver`.
