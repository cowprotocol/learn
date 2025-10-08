import type { PublicClient, WalletClient } from 'viem';
import { parseEther } from 'viem';

import { SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { walletClient } = await setup(SupportedChainId.MAINNET);
	const [ownerAddress] = await walletClient.getAddresses();

	const tx = {
		to: ownerAddress,
		value: parseEther('0.01'),
		account: walletClient.account
	};

	// Implement cancellation

	const [hash] = await Promise.all([walletClient.sendTransaction(tx)]);
}
