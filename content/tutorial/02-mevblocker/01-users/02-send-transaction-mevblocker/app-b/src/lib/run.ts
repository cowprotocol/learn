import type { PublicClient, WalletClient } from 'viem';
import { parseEther } from 'viem';

import { SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { publicClient, walletClient } = await setup(SupportedChainId.MAINNET);
	const [ownerAddress] = await walletClient.getAddresses();

	const tx = {
		to: ownerAddress,
		value: parseEther('0.01'),
		account: walletClient.account
	};

	// Send the transaction
	const hash = await walletClient.sendTransaction(tx);
	console.log(`Transaction sent! https://rpc.mevblocker.io/tx/${hash}`);

	// Wait for the transaction to be included
	await publicClient.waitForTransactionReceipt({ hash });
	console.log('Transaction confirmed');

	return `https://etherscan.io/tx/${hash}`;
}
