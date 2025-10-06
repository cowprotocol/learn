import type { PublicClient, WalletClient } from 'viem';
import { CowSdk, SupportedChainId, OrderQuoteSideKindSell, latest } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const adapter = new ViemAdapter({ publicClient, walletClient });

	const cowSdk = new CowSdk({
		adapter,
		chainId,
		env: 'prod'
	});

	const [ownerAddress] = await walletClient.getAddresses();

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
