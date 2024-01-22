import type { Web3Provider } from '@ethersproject/providers';

export async function run(provider: Web3Provider): Promise<unknown> {
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

	return await provider.send('wallet_addEthereumChain', [networkConfig]);
}
