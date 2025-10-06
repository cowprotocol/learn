import type { Web3Provider } from '@ethersproject/providers';
import { OrderBookApi, MetadataApi, SupportedChainId } from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
  const chainId = +(await provider.send('eth_chainId', []));
  if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
    throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
  }

  const signer = provider.getSigner();
  const adapter = new EthersV5Adapter({ provider, signer });

  // Initialize packages individually
  const orderBookApi = new OrderBookApi({ chainId });
  const metadataApi = new MetadataApi(adapter);

  try {
    // Test OrderBookApi
    const testOrderUid = '0x8464affce2df48b60f6976e51414dbc079e9c30ef64f4c1f78c7abe2c7f96a0c29104bb91ada737a89393c78335e48ff4708727e659523a1';
    const order = await orderBookApi.getOrder(testOrderUid);

    // Test MetadataApi
    const appDataDoc = await metadataApi.generateAppDataDoc({
      appCode: 'Individual Basic Usage',
      environment: 'production',
      metadata: {
        quote: { slippageBips: 50 },
        orderClass: { orderClass: 'market' }
      }
    });
    const { appDataHex } = await metadataApi.getAppDataInfo(appDataDoc);

    return {
      orderBook: {
        uid: order.uid.substring(0, 10) + '...',
        status: order.status
      },
      metadata: {
        appDataHex: appDataHex.substring(0, 10) + '...'
      }
    };
  } catch (error) {
    return {
      error: 'Test order not found, but packages initialized correctly'
    };
  }
}
