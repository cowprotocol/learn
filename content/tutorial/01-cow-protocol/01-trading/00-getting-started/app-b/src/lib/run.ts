import type { PublicClient, WalletClient } from 'viem';

import { SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { publicClient, walletClient } = await setup(SupportedChainId.GNOSIS_CHAIN);
	console.log('Hello world!');

	// Get the chain ID and connected account
	const chainId = await publicClient.getChainId();
	const [account] = await walletClient.getAddresses();

	return {
		message: 'Hello world!',
		chainId,
		account
	};
}
