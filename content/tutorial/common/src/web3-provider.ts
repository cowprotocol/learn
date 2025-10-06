import { createPublicClient, createWalletClient, custom } from 'viem'
import type { PublicClient, WalletClient } from 'viem'
import { gnosis } from 'viem/chains'

// Create viem clients from window.ethereum
export const publicClient: PublicClient | null = window.ethereum
  ? createPublicClient({
      transport: custom(window.ethereum),
			chain: gnosis
    })
  : null

export const walletClient: WalletClient | null = window.ethereum
  ? createWalletClient({
      transport: custom(window.ethereum),
			chain: gnosis
    })
  : null
