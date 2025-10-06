import type { Web3Provider } from '@ethersproject/providers'
import { setGlobalAdapter , getGlobalAdapter} from '@cowprotocol/cow-sdk'
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter'

export async function run(provider: Web3Provider): Promise<unknown> {
  // Create the Ethers v5 adapter with provider and signer
  const signer = provider.getSigner()
  const adapter = new EthersV5Adapter({ provider, signer })

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
