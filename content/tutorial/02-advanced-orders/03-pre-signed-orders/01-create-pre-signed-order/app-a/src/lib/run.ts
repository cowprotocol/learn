import type { WalletClient, PublicClient } from 'viem'
import {
  SupportedChainId,
  OrderBookApi,
  MetadataApi,
  latest,
  setGlobalAdapter
} from '@cowprotocol/cow-sdk'
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter'

function setupAdapter(walletClient: WalletClient, publicClient: PublicClient) {
  const adapter = new ViemAdapter({ walletClient, publicClient })
  setGlobalAdapter(adapter)
  return { adapter }
}

export async function run(walletClient: WalletClient, publicClient: PublicClient): Promise<unknown> {
  const chainId = await publicClient.getChainId();
  if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
      await walletClient.switchChain({ id: SupportedChainId.GNOSIS_CHAIN });
  }

  setupAdapter(walletClient, publicClient)
  const orderBookApi = new OrderBookApi({ chainId })
  const metadataApi = new MetadataApi()

  const appCode = 'Decentralized CoW'
  const environment = 'production'
  const referrer = { address: `0xcA771eda0c70aA7d053aB1B25004559B918FE662` }
  const quoteAppDoc: latest.Quote = { slippageBips: 50 }
  const orderClass: latest.OrderClass = { orderClass: 'limit' }

  const appDataDoc = await metadataApi.generateAppDataDoc({
    appCode,
    environment,
    metadata: {
      referrer,
      quote: quoteAppDoc,
      orderClass
    },
  })

  const { cid, appDataHex, appDataContent } = await metadataApi.getAppDataInfo(appDataDoc)

  const [ownerAddress] = await walletClient.getAddresses();

  // TODO: Implement!
  return {}
}
