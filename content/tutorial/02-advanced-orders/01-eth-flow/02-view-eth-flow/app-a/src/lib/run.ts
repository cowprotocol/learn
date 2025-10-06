import type { WalletClient, PublicClient } from 'viem';
import { SupportedChainId } from '@cowprotocol/cow-sdk';
import abi from './ethFlow.abi.json';

export async function run(walletClient: WalletClient, publicClient: PublicClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		await walletClient.switchChain({ id: 100 });
	}

	const ethFlowAddress = '0x40A50cf069e992AA4536211B23F286eF88752187';

	// TODO: Implement
	return {};
}
