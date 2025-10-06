import {
	OrderBookApi,
	OrderQuoteRequest,
	OrderKind,
	OrderSigningUtils,
	SupportedChainId,
	UnsignedOrder,
	setGlobalAdapter
} from '@cowprotocol/cow-sdk';
import type { PublicClient, WalletClient } from 'viem';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

// Helper function to setup adapter (will be used in all tutorials from now on)
function setupAdapter(publicClient: PublicClient, walletClient: WalletClient) {
	const adapter = new ViemAdapter({ provider: publicClient, walletClient });
	setGlobalAdapter(adapter);
	return { adapter };
}

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });

	const { adapter } = setupAdapter(publicClient, walletClient);
	const [ownerAddress] = await walletClient.getAddresses();

	const sellToken = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'; // wxDAI
	const buyToken = '0x177127622c4A00F3d409B75571e12cB3c8973d3c'; // COW
	const sellAmount = '1000000000000000000'; // 1 wxDAI

	const quoteRequest: OrderQuoteRequest = {
		sellToken,
		buyToken,
		from: ownerAddress,
		receiver: ownerAddress,
		sellAmountBeforeFee: sellAmount,
		kind: OrderKind.SELL
	};

	const { quote } = await orderBookApi.getQuote(quoteRequest);

	// Use the original sellAmount, which is equal to quoted sellAmount added to quoted feeAmount
	// sellAmount === (BigInt(quote.sellAmount) + BigInt(quote.feeAmount)).toString()

	// And feeAmount must be set to 0
	const feeAmount = '0';

	const order: UnsignedOrder = {
		...quote,
		sellAmount,
		feeAmount,
		receiver: ownerAddress
	};

	return OrderSigningUtils.signOrder(order, chainId, adapter);
}
