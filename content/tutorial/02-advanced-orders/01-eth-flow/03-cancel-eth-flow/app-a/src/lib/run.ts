import type { WalletClient, PublicClient } from 'viem'
import { SupportedChainId, UnsignedOrder } from '@cowprotocol/cow-sdk'
import { onchainOrderToHash } from '/src/lib/gpv2Order';
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

    // TODO: Implement
    return {}
}
