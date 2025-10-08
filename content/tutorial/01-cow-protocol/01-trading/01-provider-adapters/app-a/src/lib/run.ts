import type { PublicClient, WalletClient } from 'viem'

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
  // TODO: create an instance of ViemAdapter using publicClient and walletClient

  return {
		publicClient,
		walletClient
  }
}
