import type { PublicClient, WalletClient } from 'viem';
import {
	OrderBookApi,
	MetadataApi,
	OrderSigningUtils,
	SupportedChainId,
	OrderQuoteSideKindSell,
	UnsignedOrder
} from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const adapter = new ViemAdapter({ publicClient, walletClient });
	const [ownerAddress] = await walletClient.getAddresses();

	// Initialize packages individually
	const orderBookApi = new OrderBookApi({ chainId });
	const metadataApi = new MetadataApi(adapter);

	try {
		// Step 1: Generate app data
		const appDataDoc = await metadataApi.generateAppDataDoc({
			appCode: 'Individual Packages Tutorial',
			environment: 'production',
			metadata: {
				referrer: { address: '0xcA771eda0c70aA7d053aB1B25004559B918FE662' },
				quote: { slippageBips: 50 },
				orderClass: { orderClass: 'market' }
			}
		});
		const { appDataHex, appDataContent } = await metadataApi.getAppDataInfo(appDataDoc);

		// Step 2: Get quote
		const { quote } = await orderBookApi.getQuote({
			sellToken: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', // wxDAI
			buyToken: '0x177127622c4A00F3d409B75571e12cB3c8973d3c', // COW
			from: ownerAddress,
			receiver: ownerAddress,
			sellAmountBeforeFee: '1000000000000000000', // 1 wxDAI
			kind: OrderQuoteSideKindSell.SELL,
			appData: appDataContent,
			appDataHash: appDataHex
		});

		// Step 3: Sign order
		const order: UnsignedOrder = {
			...quote,
			sellAmount: '1000000000000000000',
			receiver: ownerAddress,
			appData: appDataHex
		};

		const signature = await OrderSigningUtils.signOrder(order, chainId, adapter);

		return {
			appData: {
				appDataHex: appDataHex.substring(0, 10) + '...'
			},
			quote: {
				sellAmount: quote.sellAmount,
				buyAmount: quote.buyAmount
			},
			signature: {
				value: signature.signature.substring(0, 10) + '...',
				scheme: signature.signingScheme
			}
		};
	} catch (error) {
		return { error: error.message };
	}
}
