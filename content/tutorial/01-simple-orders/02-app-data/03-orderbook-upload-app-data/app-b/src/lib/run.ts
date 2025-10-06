import type { PublicClient, WalletClient } from 'viem';
import {
	OrderBookApi,
	MetadataApi,
	latest,
	SupportedChainId,
	setGlobalAdapter
} from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

// Helper function to setup adapter
function setupAdapter(publicClient: PublicClient, walletClient: WalletClient) {
	const adapter = new ViemAdapter({ provider: publicClient, walletClient });
	setGlobalAdapter(adapter);
	return { adapter };
}

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	setupAdapter(publicClient, walletClient);

	const chainId = await publicClient.getChainId();
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
