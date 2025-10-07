import { parseEther } from 'viem';
import type { PublicClient, WalletClient } from 'viem';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const [ownerAddress] = await walletClient.getAddresses();

	const tx = {
		to: ownerAddress,
		value: parseEther('0.01')
	};

	// Implement cancellation

	const [hash] = await Promise.all([walletClient.sendTransaction(tx)]);
}
