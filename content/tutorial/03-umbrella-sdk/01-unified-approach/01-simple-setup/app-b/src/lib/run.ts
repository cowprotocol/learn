import type { PublicClient, WalletClient } from 'viem';
import { CowSdk, SupportedChainId } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
	}

	const adapter = new ViemAdapter({ publicClient, walletClient });

	// Initialize CowSdk with basic configuration
	const cowSdk = new CowSdk({
		adapter,
		chainId,
		env: 'prod'
	});

	// Explore available modules through the unified SDK
	//const orderBook = cowSdk.orderBook;
	//const orderSigning = cowSdk.orderSigning;

	// Test a simple operation using the unified approach
	const testOrderUid =
		'0x8464affce2df48b60f6976e51414dbc079e9c30ef64f4c1f78c7abe2c7f96a0c29104bb91ada737a89393c78335e48ff4708727e659523a1';

	const order = await cowSdk.orderBook.getOrder(testOrderUid);
	return { order };
}
