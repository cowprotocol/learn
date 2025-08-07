import type { Web3Provider } from '@ethersproject/providers';
import {
	OrderBookApi,
	MetadataApi,
	OrderSigningUtils,
	SupportedChainId,
	OrderQuoteSideKindSell
} from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
	const chainId = +(await provider.send('eth_chainId', []));
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const signer = provider.getSigner();
	const adapter = new EthersV5Adapter({ provider, signer });

	// Initialize individual packages
	const orderBookApi = new OrderBookApi({ chainId });
	const metadataApi = new MetadataApi(adapter);

	// TODO: Complete workflow using individual packages
	// 1. Generate app data with metadataApi
	// 2. Get quote with orderBookApi
	// 3. Sign order with OrderSigningUtils

	return {};
}
