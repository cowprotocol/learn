import type { PublicClient, WalletClient } from 'viem';
import { CowSdk, SupportedChainId } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const adapter = new ViemAdapter({ publicClient, walletClient });

	// TODO: Initialize CowSdk with adapter and chainId
	// TODO: Explore available modules

	return {};
}
