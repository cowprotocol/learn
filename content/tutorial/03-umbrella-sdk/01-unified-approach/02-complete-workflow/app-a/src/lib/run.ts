import type { Web3Provider } from '@ethersproject/providers';
import { CowSdk, SupportedChainId, OrderQuoteSideKindSell, latest } from '@cowprotocol/cow-sdk';
import { EthersV5Adapter } from '@cowprotocol/sdk-ethers-v5-adapter';

export async function run(provider: Web3Provider): Promise<unknown> {
	const chainId = +(await provider.send('eth_chainId', []));
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const signer = provider.getSigner();
	const adapter = new EthersV5Adapter({ provider, signer });

	const cowSdk = new CowSdk({
		adapter,
		chainId,
		env: 'prod'
	});

	const ownerAddress = await signer.getAddress();

	// Trading parameters
	const sellToken = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'; // wxDAI
	const buyToken = '0x177127622c4A00F3d409B75571e12cB3c8973d3c'; // COW
	const sellAmount = '1000000000000000000'; // 1 wxDAI

	// TODO: Complete workflow using CowSdk modules:
	// 1. Generate app data using cowSdk.metadataApi
	// 2. Get quote using cowSdk.orderBook
	// 3. Sign order using cowSdk.orderSigning

	return {};
}
