import type { PublicClient, WalletClient } from 'viem';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
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
