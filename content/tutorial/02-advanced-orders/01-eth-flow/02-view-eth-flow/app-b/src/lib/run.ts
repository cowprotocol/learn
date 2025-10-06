import type { WalletClient, PublicClient, Abi } from 'viem';
import { decodeEventLog } from 'viem';
import { SupportedChainId } from '@cowprotocol/cow-sdk';
import { onchainOrderToHash } from '/src/lib/gpv2Order';
import abi from './ethFlow.abi.json';

export async function run(walletClient: WalletClient, publicClient: PublicClient): Promise<unknown> {
	const chainId = await publicClient.getChainId();
	if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
		await walletClient.switchChain({ id: 100 });
	}

	const ethFlowAddress = '0x40A50cf069e992AA4536211B23F286eF88752187';

	const ethFlowOrderUid = (onchainOrder: any) => {
		const hash = onchainOrderToHash(onchainOrder, chainId);
		return hash + ethFlowAddress.slice(2) + 'ffffffff';
	};

	const txHash = '0x1a1eb56678cf1936711df3de6e9ff02accef52808ecbd704a8547c62dcfb42f5';
	const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });

	const ethFlowOrderUids: string[] = receipt.logs.reduce((orderIds, log) => {
		if (log.address.toLowerCase() !== ethFlowAddress.toLowerCase()) {
			return orderIds;
		}

		try {
			const decoded = decodeEventLog({
				abi: abi as Abi,
				data: log.data,
				topics: log.topics
			});

			if (decoded.eventName === 'OrderPlacement') {
				const order = (decoded.args as any).order;
				orderIds.push(ethFlowOrderUid(order));
			}
		} catch (error) {
			// Skip logs that don't match
		}

		return orderIds;
	}, [] as string[]);

	return {
		ethFlowOrderUids
	};
}
