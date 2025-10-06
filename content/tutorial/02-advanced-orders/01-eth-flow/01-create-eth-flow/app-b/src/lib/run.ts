import type { WalletClient, PublicClient, Abi } from 'viem';
import {
	SupportedChainId,
	OrderBookApi,
	UnsignedOrder,
	SigningScheme,
	OrderQuoteRequest,
	OrderQuoteSideKindSell,
	MetadataApi,
	latest,
	setGlobalAdapter
} from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';
import abi from './ethFlow.abi.json';

// Helper function to setup adapter
function setupAdapter(walletClient: WalletClient, publicClient: PublicClient) {
	const adapter = new ViemAdapter({ walletClient, publicClient });
	setGlobalAdapter(adapter);
	return { adapter };
}

type EthFlowOrder = Omit<
	UnsignedOrder,
	'sellToken' | 'sellTokenBalance' | 'buyTokenBalance' | 'kind' | 'signingScheme'
> & {
	quoteId: number;
};

export async function run(walletClient: WalletClient, publicClient: PublicClient): Promise<unknown> {
	setupAdapter(walletClient, publicClient);

	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		await walletClient.switchChain({ id: SupportedChainId.GNOSIS_CHAIN });
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

	const [ownerAddress] = await walletClient.getAddresses();

	const ethFlowAddress = '0x40A50cf069e992AA4536211B23F286eF88752187';

	const sellToken = await publicClient.readContract({
		address: ethFlowAddress as `0x${string}`,
		abi: abi as Abi,
		functionName: 'wrappedNativeToken'
	}) as `0x${string}`;
	const buyToken = '0x177127622c4A00F3d409B75571e12cB3c8973d3c'; // COW
	const sellAmount = '1000000000000000000'; // 1 wxDAI

	const quoteRequest: OrderQuoteRequest = {
		sellToken,
		buyToken,
		sellAmountBeforeFee: sellAmount,
		kind: OrderQuoteSideKindSell.SELL,
		receiver: ownerAddress,
		from: ownerAddress,
		appData: appDataContent,
		appDataHash: appDataHex,
		signingScheme: SigningScheme.EIP1271,
		onchainOrder: true
	};

	const { quote, id: quoteId } = await orderBookApi.getQuote(quoteRequest);

	const order: EthFlowOrder = {
		...quote,
		buyAmount: (BigInt(quote.buyAmount) * 9950n / 10000n).toString(),
		receiver: ownerAddress,
		appData: appDataHex,
		quoteId
	};

	const hash = await walletClient.writeContract({
		address: ethFlowAddress as `0x${string}`,
		abi: abi as Abi,
		functionName: 'createOrder',
		args: [order],
		value: BigInt(sellAmount)
	});
	console.log('Transaction Hash:', hash);
	const receipt = await publicClient.waitForTransactionReceipt({ hash });

	return receipt;
}
