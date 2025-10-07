import type { PublicClient, WalletClient } from 'viem'

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
  // TODO: create an isntace of ViemAdapter using publicClient and walletClient

  return {
		publicClient,
		walletClient
  }
}
