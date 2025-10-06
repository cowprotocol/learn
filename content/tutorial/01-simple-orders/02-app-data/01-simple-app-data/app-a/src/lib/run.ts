import type { PublicClient, WalletClient } from 'viem';
import { MetadataApi, setGlobalAdapter } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

// Helper function to setup adapter (will be used in all tutorials from now on)
function setupAdapter(publicClient: PublicClient, walletClient: WalletClient) {
	const adapter = new ViemAdapter({ provider: publicClient, walletClient });
	setGlobalAdapter(adapter);
	return { adapter };
}

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	setupAdapter(publicClient, walletClient);
	// MetadataApi now requires the global adapter but we dont need to pass it
	// because we are using the global adapter setup in the setupAdapter function
	const metadataApi = new MetadataApi();

	// TODO: Implement
	return {};
}
