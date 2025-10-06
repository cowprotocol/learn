import type { Web3Provider } from '@ethersproject/providers';
import { CowSdk, SupportedChainId } from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
	const chainId = +(await provider.send('eth_chainId', []));
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const signer = provider.getSigner();
	const adapter = new EthersV5Adapter({ provider, signer });

	// TODO: Initialize CowSdk with adapter and chainId
	// TODO: Explore available modules

	return {};
}
