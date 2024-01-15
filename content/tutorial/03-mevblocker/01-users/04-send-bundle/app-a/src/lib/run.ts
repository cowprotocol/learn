import { utils, providers } from 'ethers';
import type { Web3Provider } from '@ethersproject/providers';

export async function run(provider: Web3Provider): Promise<unknown> {
	const signer = provider.getSigner();
	const address = await signer.getAddress();
	const nonce = await signer.getTransactionCount();

	// low priority fee transaction first
	const first = {
		to: address,
		value: utils.parseEther('0.01'),
		gasLimit: 21000,
		maxPriorityFee: 0,
		maxFeePerGas: utils.parseUnits('100', 'gwei'),
		nonce: nonce,
		type: 2,
		chainId: 1
	};

	// higher priority fee transaction second
	const second = {
		to: address,
		value: utils.parseEther('0.02'),
		gasLimit: 21000,
		maxPriorityFee: utils.parseUnits('1', 'gwei'),
		maxFeePerGas: utils.parseUnits('100', 'gwei'),
		nonce: nonce + 1,
		type: 2,
		chainId: 1
	};
}
