import type { WalletClient, PublicClient, Abi } from 'viem'
import { decodeEventLog } from 'viem';
import { SupportedChainId, UnsignedOrder } from '@cowprotocol/cow-sdk'
import { onchainOrderToOrder, onchainOrderToHash } from '/src/lib/gpv2Order';
import abi from './ethFlow.abi.json'

type EthFlowOrder = Omit<UnsignedOrder, 'sellToken' | 'sellTokenBalance' | 'buyTokenBalance' | 'kind' | 'signingScheme'> & {
    quoteId: number;
}

export async function run(walletClient: WalletClient, publicClient: PublicClient): Promise<unknown> {
    const chainId = await publicClient.getChainId();
    if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
        await walletClient.switchChain({ id: 100 });
    }

    const ethFlowAddress = '0x40A50cf069e992AA4536211B23F286eF88752187';

    const ethFlowOrderUid = (onchainOrder: any) => {
        const hash = onchainOrderToHash(onchainOrder, chainId);
        return hash + ethFlowAddress.slice(2) + 'ffffffff';
    }

    const decodePackedData = (data: string) => {
        // Ensure data is of correct length (8 bytes for int64 + 4 bytes for uint32)
        if (data.length !== 2 * (8 + 4) + 2) { // +2 for '0x'
            throw new Error('Invalid data length');
        }

        // Extract quoteId (int64) and validTo (uint32) from the data
        const quoteIdBytes = data.slice(2, 2 + 16); // 8 bytes for int64
        const validToBytes = data.slice(2 + 16); // 4 bytes for uint32

        // Convert hex strings to numbers
        const quoteId = Number(BigInt('0x' + quoteIdBytes));
        const validTo = Number(BigInt('0x' + validToBytes));

        return { quoteId, validTo };
    }

    const onchainEthFlowOrder = (onchainOrder: any, data: any): EthFlowOrder => {
        const order = onchainOrderToOrder(onchainOrder);
        const { quoteId } = decodePackedData(data);

        return {
            buyToken: order.buyToken,
            sellAmount: order.sellAmount.toString(),
            buyAmount: order.buyAmount.toString(),
            receiver: order.receiver,
            appData: order.appData.toString(),
            feeAmount: order.feeAmount.toString(),
            partiallyFillable: order.partiallyFillable,
            validTo: order.validTo.valueOf(),
            quoteId,
        }
    }

    const txHash = '0x04d05fc2c953cc63608c19a79869301d62b1f077e0f795f716619b21f693f00c';
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });

    let cancelledOrders = [];

    for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== ethFlowAddress.toLowerCase()) {
            continue;
        }

        try {
            const decoded = decodeEventLog({
                abi: abi as Abi,
                data: log.data,
                topics: log.topics
            });

            if (decoded.eventName === 'OrderPlacement') {
                const args = decoded.args as any;
                const onchainOrder = args.order;
                const data = args.data;
                const ethFlowOrder = onchainEthFlowOrder(onchainOrder, data);

                try {
                    const hash = await walletClient.writeContract({
                        address: ethFlowAddress as `0x${string}`,
                        abi: abi as Abi,
                        functionName: 'invalidateOrder',
                        args: [ethFlowOrder]
                    });
                    const txReceipt = await publicClient.waitForTransactionReceipt({ hash });
                    cancelledOrders.push({
                        ethFlowOrderUid: ethFlowOrderUid(onchainOrder),
                        receipt: txReceipt,
                    });
                } catch (err) {
                    throw new Error(err as string);
                }
            }
        } catch (error) {
            // Skip logs that don't match
        }
    }

    return {
        cancelledOrders,
    }
}
