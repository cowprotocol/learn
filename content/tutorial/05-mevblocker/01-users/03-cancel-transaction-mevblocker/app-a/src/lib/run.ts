import { utils } from 'ethers';
import type { Web3Provider } from '@ethersproject/providers';

export async function run(provider: Web3Provider): Promise<unknown> {
	const signer = provider.getSigner();

	const tx = {
		to: await signer.getAddress(),
		value: utils.parseEther('0.01')
	};

	// Implement cancellation

	const [transactionResponse] = await Promise.all([signer.sendTransaction(tx)]);
}
