import type { Web3Provider } from '@ethersproject/providers';
import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(provider: Web3Provider): Promise<unknown> {
	const chainId = +(await provider.send('eth_chainId', []));
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	// TODO: Initialize OrderBookApi individually
	// TODO: Test basic functionality

	return {};
}
