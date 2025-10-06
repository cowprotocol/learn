import type { PublicClient, WalletClient } from 'viem';
import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });

	// TODO: Retrieve app data using getAppData method
	return {};
}
