import type { PublicClient, WalletClient } from 'viem'

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	console.log('Hello world!');

	// Get the chain ID and connected account
	const chainId = await publicClient.getChainId()
	const [account] = await walletClient.getAddresses()

	return {
		message: "Hello world!",
		chainId,
		account
	}
}
