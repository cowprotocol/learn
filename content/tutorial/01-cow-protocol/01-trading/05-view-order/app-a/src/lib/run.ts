import type { PublicClient, WalletClient } from 'viem';
import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { publicClient, walletClient } = await setup(SupportedChainId.GNOSIS_CHAIN);

	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });

	// TODO: call orderBookApi with some orderUid to get an order data

	return {};
}
