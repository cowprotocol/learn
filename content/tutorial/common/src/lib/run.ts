import type { PublicClient, WalletClient } from 'viem';

export async function run(
	publicClient: PublicClient,
	walletClient: WalletClient
): Promise<unknown> {
	console.log({publicClient, walletClient});

	return Promise.resolve('');
}
