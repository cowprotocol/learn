import type { PublicClient, WalletClient } from 'viem';
import {
	CowSdk,
	SupportedChainId,
	OrderQuoteSideKindSell,
	latest,
	UnsignedOrder
} from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const adapter = new ViemAdapter({ publicClient, walletClient });

	// Initialize unified SDK
	const cowSdk = new CowSdk({
		adapter,
		chainId,
		env: 'prod'
	});

	const [ownerAddress] = await walletClient.getAddresses();

	// Trading parameters
	const sellToken = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d';
	const buyToken = '0x177127622c4A00F3d409B75571e12cB3c8973d3c';
	const sellAmount = '1000000000000000000';

	// 1. Generate app data using unified SDK
	const appDataDoc = await cowSdk.metadataApi.generateAppDataDoc({
		appCode: 'Decentralized CoW',
		environment: 'production',
		metadata: {
			referrer: { address: '0xcA771eda0c70aA7d053aB1B25004559B918FE662' },
			quote: { slippageBips: 50 },
			orderClass: { orderClass: 'market' }
		}
	});

	const { cid, appDataHex, appDataContent } = await cowSdk.metadataApi.getAppDataInfo(appDataDoc);

	// 2. Get quote using unified SDK
	const { quote } = await cowSdk.orderBook.getQuote({
		sellToken,
		buyToken,
		from: ownerAddress,
		receiver: ownerAddress,
		sellAmountBeforeFee: sellAmount,
		kind: OrderQuoteSideKindSell.SELL,
		appData: appDataContent,
		appDataHash: appDataHex
	});

	// 3. Prepare and sign order using unified SDK
	const order: UnsignedOrder = {
		...quote,
		sellAmount,
		feeAmount: '0',
		receiver: ownerAddress,
		appData: appDataHex
	};

	const orderSigningResult = await cowSdk.orderSigning.signOrder(order, chainId, adapter);

	return {
		appDataHash: appDataHex,
		expectedBuyAmount: quote.buyAmount,
		signature: orderSigningResult.signature.substring(0, 20) + '...',
		signingScheme: orderSigningResult.signingScheme
	};
}
