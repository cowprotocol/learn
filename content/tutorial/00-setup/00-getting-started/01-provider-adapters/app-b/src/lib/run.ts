import { setGlobalAdapter , getGlobalAdapter} from '@cowprotocol/cow-sdk'
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter'
import type { PublicClient, WalletClient } from 'viem';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
  // Create the ViemAdapter adapter with provider and signer
	const adapter = new ViemAdapter({
		provider: publicClient,
		walletClient,
	});

  // Set as global adapter - now all SDK classes will use this automatically
  setGlobalAdapter(adapter)

  // Test basic functionality
  const chainId = await adapter.getChainId()
  const address = await adapter.signer.getAddress()

  const globalAdapter = getGlobalAdapter()

  const adapterInfo = globalAdapter ? {
    type: globalAdapter.constructor.name,
    hasSigner: !!globalAdapter.signer,
    adapterChainId: await globalAdapter.getChainId(),
  } : null

  return {
    globalAdapterConfigured: !!globalAdapter,
    adapterInfo,
    chainId,
    address,
  }
}
