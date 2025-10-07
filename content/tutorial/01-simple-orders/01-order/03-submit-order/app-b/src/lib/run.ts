import type { PublicClient, WalletClient } from 'viem'
import { SupportedChainId, OrderKind, TradingSdk, TradeParameters } from '@cowprotocol/cow-sdk'
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter'

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const adapter = new ViemAdapter({
		provider: publicClient,
		walletClient,
	});

	const sdk = new TradingSdk({
		chainId: SupportedChainId.GNOSIS_CHAIN,
		appCode: 'CoW Swap',
	}, {}, adapter);

	const sellToken = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'; // wxDAI
	const buyToken = '0x177127622c4A00F3d409B75571e12cB3c8973d3c'; // COW

	const parameters: TradeParameters = {
		kind: OrderKind.SELL,
		sellToken,
		sellTokenDecimals: 18,
		buyToken,
		buyTokenDecimals: 18,
		amount: '1000000000000000000', // 1 wxDAI
	};

	const { postSwapOrderFromQuote } = await sdk.getQuote(parameters);

	const postingResult = await postSwapOrderFromQuote({
		// Optional: you can specify advanced settings before posting an order
		quoteRequest: {
			validTo: Math.ceil((Date.now() + (120 * 1000)) / 1000) // 2 min
		}
	})

	return {
		explorerLink: `https://explorer.cow.fi/search/${postingResult.orderId}`,
		postingResult
	};
}
