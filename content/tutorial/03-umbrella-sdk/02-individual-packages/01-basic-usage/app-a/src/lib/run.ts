import type { PublicClient, WalletClient } from 'viem';
import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	// TODO: Initialize OrderBookApi individually
	// TODO: Test basic functionality

	return {};
}
