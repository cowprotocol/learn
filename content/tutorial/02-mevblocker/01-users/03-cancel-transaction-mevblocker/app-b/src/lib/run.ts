import { parseEther } from 'viem';
import type { PublicClient, WalletClient } from 'viem';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const [ownerAddress] = await walletClient.getAddresses();

	const nonce = await publicClient.getTransactionCount({ address: ownerAddress });
	const tx = {
		to: ownerAddress,
		value: parseEther('0.01'),
		nonce
	};

	const cancellation = {
		to: ownerAddress,
		nonce
	};

	const [hash, _] = await Promise.all([
		walletClient.sendTransaction(tx),
		walletClient.sendTransaction(cancellation)
	]);
	return `Cancellation sent! Check https://rpc.mevblocker.io/tx/${hash}`;
}
