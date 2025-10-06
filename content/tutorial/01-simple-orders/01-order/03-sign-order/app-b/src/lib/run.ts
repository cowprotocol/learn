import {
	OrderBookApi,
	OrderQuoteRequest,
	OrderQuoteSideKindSell,
	OrderSigningUtils,
	SupportedChainId,
	UnsignedOrder,
	setGlobalAdapter
} from '@cowprotocol/cow-sdk';
import type { Web3Provider } from '@ethersproject/providers';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

// Helper function to setup adapter (will be used in all tutorials from now on)
function setupAdapter(provider: Web3Provider) {
	const signer = provider.getSigner();
	const adapter = new EthersV5Adapter({ provider, signer });
	setGlobalAdapter(adapter);
	return { signer, adapter };
}

export async function run(provider: Web3Provider): Promise<unknown> {
	const chainId = +(await provider.send('eth_chainId', []));
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });

	const { signer } = setupAdapter(provider);
	const ownerAddress = await signer.getAddress();

	const sellToken = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'; // wxDAI
	const buyToken = '0x177127622c4A00F3d409B75571e12cB3c8973d3c'; // COW
	const sellAmount = '1000000000000000000'; // 1 wxDAI

	const quoteRequest: OrderQuoteRequest = {
		sellToken,
		buyToken,
		from: ownerAddress,
		receiver: ownerAddress,
		sellAmountBeforeFee: sellAmount,
		kind: OrderQuoteSideKindSell.SELL
	};

	const { quote } = await orderBookApi.getQuote(quoteRequest);

	// Use the original sellAmount, which is equal to quoted sellAmount added to quoted feeAmount
	// sellAmount === BigNumber.from(quote.sellAmount).add(BigNumber.from(quote.feeAmount)).toString()

	// And feeAmount must be set to 0
	const feeAmount = '0';

	const order: UnsignedOrder = {
		...quote,
		sellAmount,
		feeAmount,
		receiver: ownerAddress
	};

	return OrderSigningUtils.signOrder(order, chainId, signer);
}
