import type { PublicClient, WalletClient } from 'viem'
import { setGlobalAdapter } from '@cowprotocol/cow-sdk'
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter'

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
  // Create adapter with your provider and wallet client
  const adapter = new ViemAdapter({
    provider: publicClient,
    walletClient
  })

  // Set as global adapter (do this once in your app)
  setGlobalAdapter(adapter)

  // Test the adapter
  const chainId = await publicClient.getChainId()
  const [address] = await walletClient.getAddresses()

  return {
    adapterType: "ViemAdapter",
    chainId,
    address,
    message: "Adapter configured successfully!"
  }
}
