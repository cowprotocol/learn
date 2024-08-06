import { OrderBookApi, OrderQuoteRequest, OrderQuoteSideKindSell, OrderSigningUtils, SigningScheme, SupportedChainId, UnsignedOrder } from '@cowprotocol/cow-sdk';
import type { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

export async function run(provider: Web3Provider): Promise<unknown> {
    const chainId = +(await provider.send('eth_chainId', []));
    if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
        throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
    }

    const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GNOSIS_CHAIN });

    const signer = provider.getSigner();
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
        kind: OrderQuoteSideKindSell.SELL,
    };

    const { quote } = await orderBookApi.getQuote(quoteRequest);

    // Quoted sellAmount must be added to quoted feeAmount, and feeAmount must be set to 0

    const order: UnsignedOrder = {
      ...quote,
      sellAmount: BigNumber.from(quote.sellAmount).add(BigNumber.from(quote.feeAmount)).toString(),
      feeAmount: '0',
      receiver: ownerAddress,
    }

    const orderSigningResult = await OrderSigningUtils.signOrder(order, chainId, signer)

    try {
        const orderId = await orderBookApi.sendOrder({
            ...quote,
            ...orderSigningResult,
            sellAmount: order.sellAmount, // replace quote sellAmount with signed order sellAmount
            feeAmount: order.feeAmount, // replace quote feeAmount with signed order feeAmount
            signingScheme: orderSigningResult.signingScheme as unknown as SigningScheme
        })
    
        return {
            orderId,
        }    
    } catch (e) {
        return e
    }
}
