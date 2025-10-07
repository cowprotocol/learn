---
title: Approving CoW Protocol
---

Before submitting an order to CoW Protocol, you need to approve the protocol to spend your sell token. The `TradingSdk` provides a convenient `approveCowProtocol` method that handles this approval process.

## Why approve?

CoW Protocol uses the [GPv2VaultRelayer](https://docs.cow.fi/cow-protocol/reference/contracts/core/vault-relayer) contract to transfer tokens from your wallet when executing trades. For the relayer to transfer your tokens, you must first grant it approval.

> **Note:** You don't need to approve native tokens (like ETH on Ethereum or xDAI on Gnosis Chain) as they are handled differently and don't require approval.

## Using approveCowProtocol

The `approveCowProtocol` method simplifies the approval process by:
- Automatically determining the correct relayer address for your chain
- Checking current allowance
- Executing the approval transaction if needed

Let's continue from the previous quote example and add the approval step:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, OrderKind, TradingSdk, TradeParameters } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const adapter = new ViemAdapter({
		provider: publicClient,
		walletClient,
	});

	const sdk = new TradingSdk({
		chainId: SupportedChainId.GNOSIS_CHAIN,
		appCode: 'CoW Swap',
	}, {}, adapter);

	const sellToken = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'; // wxDAI
	const buyToken = '0x177127622c4A00F3d409B75571e12cB3c8973d3c'; // COW

	const parameters: TradeParameters = {
		kind: OrderKind.SELL,
		sellToken,
		sellTokenDecimals: 18,
		buyToken,
		buyTokenDecimals: 18,
		amount: '1000000000000000000', // 1 wxDAI
	};

	const { quoteResults } = await sdk.getQuote(parameters);

	// Approve CoW Protocol to spend the sell token
	const approvalTx = await sdk.approveCowProtocol({
		tokenAddress: sellToken,
		amount: parameters.amount, // You can also use a larger amount or 'max' for unlimited approval
	});

	return {
		approvalTxHash: approvalTx,
		message: 'CoW Protocol has been approved to spend your wxDAI'
	};
}
```

## Approval options

The `approveCowProtocol` method accepts the following parameters:

- `tokenAddress`: The address of the token you want to approve
- `amount`: The amount to approve. You can specify:
  - A specific amount (e.g., the amount you want to trade)
  - A larger amount to avoid frequent approvals
  - The string `'max'` for unlimited approval (max uint256 value)

### Example with unlimited approval

```typescript
/// file: run.ts
// Approve unlimited amount
const approvalTx = await sdk.approveCowProtocol({
	tokenAddress: sellToken,
	amount: 'max', // Unlimited approval
});
```

## Run the code

To run the code, press the "Run" button in the bottom right panel (the web container).

When running the script:

1. Accept the connection request in your wallet (e.g., Rabby)
2. Press the "Run" button again
3. Confirm the approval transaction in your wallet
4. Wait for the transaction to be confirmed

The output will show:
- The transaction hash of the approval
- A confirmation message

### Important notes

- **Native tokens**: If you're selling a native token (ETH, xDAI, etc.), you can skip this step as native tokens don't require approval
- **Existing approvals**: If you've already approved CoW Protocol for this token, you may not need to approve again unless you want to increase the allowance
- **Gas costs**: The approval requires a blockchain transaction and will cost gas fees

After successfully approving the token, you're ready to submit your order in the next tutorial step.
