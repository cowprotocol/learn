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
			'https://rpc.mevblocker.io?refundRecipient=0x76bA9825A5F707F133124E4608F1F2Dd1EF4006a&softcancel=1&referrer=learn.cow.fi'
		],
		blockExplorerUrls: ['https://etherscan.io']
	};

	return await walletClient.request({
		method: 'wallet_addEthereumChain',
		params: [networkConfig]
	});
}
