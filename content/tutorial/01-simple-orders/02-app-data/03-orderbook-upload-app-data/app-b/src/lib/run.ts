import type { Web3Provider } from '@ethersproject/providers';
import {
	OrderBookApi,
	MetadataApi,
	latest,
	SupportedChainId,
	setGlobalAdapter
} from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

// Helper function to setup adapter
function setupAdapter(provider: Web3Provider) {
	const signer = provider.getSigner();
	const adapter = new EthersV5Adapter({ provider, signer });
	setGlobalAdapter(adapter);
	return { signer, adapter };
}

export async function run(provider: Web3Provider): Promise<unknown> {
	setupAdapter(provider);

	const chainId = +(await provider.send('eth_chainId', []));
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });
	const metadataApi = new MetadataApi();

	const appCode = 'Decentralized CoW';
	const environment = 'production';
	const referrer = { address: `0xcA771eda0c70aA7d053aB1B25004559B918FE662` };

	const quoteAppDoc: latest.Quote = { slippageBips: 50 };
	const orderClass: latest.OrderClass = { orderClass: 'market' };

	const appDataDoc = await metadataApi.generateAppDataDoc({
		appCode,
		environment,
		metadata: {
			referrer,
			quote: quoteAppDoc,
			orderClass
		}
	});

	const { cid, appDataHex, appDataContent } = await metadataApi.getAppDataInfo(appDataDoc);

	const fullAppData = await orderBookApi.uploadAppData(appDataHex, appDataContent);

	return { fullAppData };
}
