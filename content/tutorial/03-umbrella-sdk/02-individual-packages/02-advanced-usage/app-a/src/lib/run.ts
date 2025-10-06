import type { PublicClient, WalletClient } from 'viem';
import {
	OrderBookApi,
	MetadataApi,
	OrderSigningUtils,
	SupportedChainId,
	OrderQuoteSideKindSell
} from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const adapter = new ViemAdapter({ publicClient, walletClient });

	// Initialize individual packages
	const orderBookApi = new OrderBookApi({ chainId });
	const metadataApi = new MetadataApi(adapter);

	// TODO: Complete workflow using individual packages
	// 1. Generate app data with metadataApi
	// 2. Get quote with orderBookApi
	// 3. Sign order with OrderSigningUtils

	return {};
}
