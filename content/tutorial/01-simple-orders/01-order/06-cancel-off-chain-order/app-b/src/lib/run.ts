import type { PublicClient, WalletClient } from 'viem';
import {
	SupportedChainId,
	OrderBookApi,
	OrderSigningUtils,
	setGlobalAdapter
} from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

// Helper function to setup adapter (will be used in all tutorials from now on)
function setupAdapter(publicClient: PublicClient, walletClient: WalletClient) {
	const adapter = new ViemAdapter({ provider: publicClient, walletClient });
	setGlobalAdapter(adapter);
	return { adapter };
}

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });
	const { adapter } = setupAdapter(publicClient, walletClient);

	const orderUid =
		'0x8464affce2df48b60f6976e51414dbc079e9c30ef64f4c1f78c7abe2c7f96a0c29104bb91ada737a89393c78335e48ff4708727e659523a1';

	const orderCancellationsSigningResult = await OrderSigningUtils.signOrderCancellations(
		[orderUid],
		chainId,
		adapter
	);

	try {
		const cancellationsResult = await orderBookApi.sendSignedOrderCancellations({
			...orderCancellationsSigningResult,
			orderUids: [orderUid]
		});

		return { cancellationsResult };
	} catch (e) {
		return e;
	}
}
