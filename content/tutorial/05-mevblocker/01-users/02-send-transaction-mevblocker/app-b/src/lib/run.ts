import { parseEther } from 'viem';
import type { PublicClient, WalletClient } from 'viem';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const [ownerAddress] = await walletClient.getAddresses();

	const tx = {
		to: ownerAddress,
		value: parseEther('0.01')
	};

	// Send the transaction
	const hash = await walletClient.sendTransaction(tx);
	console.log(`Transaction sent! https://rpc.mevblocker.io/tx/${hash}`);

	// Wait for the transaction to be included
	await publicClient.waitForTransactionReceipt({ hash });
	console.log('Transaction confirmed');

	return `https://etherscan.io/tx/${hash}`;
}
