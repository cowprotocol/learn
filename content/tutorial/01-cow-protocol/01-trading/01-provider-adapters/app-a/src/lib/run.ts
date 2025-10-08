import type { PublicClient, WalletClient } from 'viem';

import { SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { publicClient, walletClient } = await setup(SupportedChainId.GNOSIS_CHAIN);
	// TODO: create an instance of ViemAdapter using publicClient and walletClient

	return {
		publicClient,
		walletClient
	};
}
