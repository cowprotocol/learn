import type { Web3Provider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
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
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';
import abi from './ethFlow.abi.json';

// Helper function to setup adapter
function setupAdapter(provider: Web3Provider) {
	const signer = provider.getSigner();
	const adapter = new EthersV5Adapter({ provider, signer });
	setGlobalAdapter(adapter);
	return { signer, adapter };
}

type EthFlowOrder = Omit<
	UnsignedOrder,
	'sellToken' | 'sellTokenBalance' | 'buyTokenBalance' | 'kind' | 'signingScheme'
> & {
	quoteId: number;
};

export async function run(provider: Web3Provider): Promise<unknown> {
	const { signer } = setupAdapter(provider);

	const chainId = +(await provider.send('eth_chainId', []));
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		await provider.send('wallet_switchEthereumChain', [{ chainId: SupportedChainId.GNOSIS_CHAIN }]);
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

	const ownerAddress = await signer.getAddress();

	const ethFlowAddress = '0x40A50cf069e992AA4536211B23F286eF88752187';
	const ethFlowContract = new Contract(ethFlowAddress, abi, signer);

	const sellToken = await ethFlowContract.wrappedNativeToken();
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
		buyAmount: BigNumber.from(quote.buyAmount).mul(9950).div(10000).toString(),
		receiver: ownerAddress,
		appData: appDataHex,
		quoteId
	};

	const tx = await ethFlowContract.createOrder(order, { value: sellAmount });
	console.log('Transaction Hash:', tx.hash);
	const receipt = await tx.wait();

	return receipt;
}
