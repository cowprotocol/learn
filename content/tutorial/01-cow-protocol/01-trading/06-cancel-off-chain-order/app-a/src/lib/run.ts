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

	// TODO: Cancel an order using sdk.offChainCancelOrder()

	return {};
}
