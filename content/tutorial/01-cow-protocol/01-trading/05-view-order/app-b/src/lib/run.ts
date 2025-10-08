import type { PublicClient, WalletClient } from 'viem';
import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { publicClient, walletClient } = await setup(SupportedChainId.GNOSIS_CHAIN);

	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });

	const orderUid =
		'0x8464affce2df48b60f6976e51414dbc079e9c30ef64f4c1f78c7abe2c7f96a0c29104bb91ada737a89393c78335e48ff4708727e659523a1';

	try {
		const order = await orderBookApi.getOrder(orderUid);
		const trades = await orderBookApi.getTrades({ orderUid });

		return {
			order,
			trades
		};
	} catch (e) {
		return e;
	}
}
