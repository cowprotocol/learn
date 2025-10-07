import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, TradingSdk } from '@cowprotocol/cow-sdk';
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

	// TODO: Cancel an order on-chain using sdk.onChainCancelOrder()

	return {};
}
