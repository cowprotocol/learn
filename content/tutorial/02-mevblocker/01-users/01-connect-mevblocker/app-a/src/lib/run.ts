import type { PublicClient, WalletClient } from 'viem';

import { SupportedChainId } from '@cowprotocol/cow-sdk';

export async function run(
	setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
	const { publicClient, walletClient } = await setup(SupportedChainId.MAINNET);
	const networkConfig = {
		chainId: '0x1', // Mainnet
		chainName: 'MEV Blocker',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH',
			decimals: 18
		},
		rpcUrls: [
			/* IMPLEMENT */
		],
		blockExplorerUrls: ['https://etherscan.io']
	};

	return await walletClient.request({
		method: 'wallet_addEthereumChain',
		params: [networkConfig]
	});
}
