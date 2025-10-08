import type { PublicClient, WalletClient } from 'viem';
import { parseEther } from 'viem';

import { SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { publicClient, walletClient } = await setup(SupportedChainId.MAINNET);
	const [ownerAddress] = await walletClient.getAddresses();

	const nonce = await publicClient.getTransactionCount({ address: ownerAddress });
	const tx = {
		to: ownerAddress,
		value: parseEther('0.01'),
		nonce,
		account: walletClient.account
	};

	const cancellation = {
		to: ownerAddress,
		nonce,
		account: walletClient.account
	};

	const [hash, _] = await Promise.all([
		walletClient.sendTransaction(tx),
		walletClient.sendTransaction(cancellation)
	]);
	return `Cancellation sent! Check https://rpc.mevblocker.io/tx/${hash}`;
}
