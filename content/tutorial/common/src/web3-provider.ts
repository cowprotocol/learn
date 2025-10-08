import type { PublicClient, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { gnosis, mainnet, bsc, base, arbitrum, polygon, lens, avalanche, sepolia, Chain } from 'viem/chains';
import { SupportedChainId } from '@cowprotocol/cow-sdk';

const viemChains: Record<SupportedChainId, Chain> = {
	[SupportedChainId.MAINNET]: mainnet,
	[SupportedChainId.GNOSIS_CHAIN]: gnosis,
	[SupportedChainId.BASE]: base,
	[SupportedChainId.ARBITRUM_ONE]: arbitrum,
	[SupportedChainId.POLYGON]: polygon,
	[SupportedChainId.BNB]: bsc,
	[SupportedChainId.LENS]: lens,
	[SupportedChainId.AVALANCHE]: avalanche,
	[SupportedChainId.SEPOLIA]: sepolia,
}

// Create viem clients from window.ethereum
export const publicClient: PublicClient | null = window.ethereum
	? createPublicClient({
			transport: custom(window.ethereum),
			chain: gnosis
		})
	: null;

export const walletClient: WalletClient | null = window.ethereum
	? createWalletClient({
			transport: custom(window.ethereum),
			chain: gnosis
		})
	: null;


export async function setupWeb3Provider(chainId: SupportedChainId) {
	if (!window.ethereum) throw new Error('Unable to initialize web3 provider');

	const chain = viemChains[chainId];

	const publicClient: PublicClient = createPublicClient({
		transport: custom(window.ethereum),
		chain
	})

	const walletClient: WalletClient = createWalletClient({
		transport: custom(window.ethereum),
		chain
	})

	await walletClient.switchChain({ id: chain.id })

	const accounts = await walletClient!.request({ method: 'eth_requestAccounts' })

	walletClient.account = {
		address: accounts[0],
		type: 'json-rpc'
	};

	console.log('Assign account to walletClient', walletClient, accounts[0]);


	return { publicClient,walletClient }
}
