import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, TradingSdk } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { publicClient, walletClient } = await setup(SupportedChainId.GNOSIS_CHAIN);

	const adapter = new ViemAdapter({
		provider: publicClient,
		walletClient
	});

	const sdk = new TradingSdk(
		{
			chainId: SupportedChainId.GNOSIS_CHAIN,
			appCode: 'CoW Swap'
		},
		{},
		adapter
	);

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
