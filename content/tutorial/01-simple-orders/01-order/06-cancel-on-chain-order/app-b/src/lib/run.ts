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

	// Put an open order uid, otherwise the cancellation will fail
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
