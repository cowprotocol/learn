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

	const [firstSignature, secondSignature] = await Promise.all([
		provider.send('eth_sign', [address, utils.keccak256(utils.serializeTransaction(first))]),
		provider.send('eth_sign', [address, utils.keccak256(utils.serializeTransaction(second))])
	]);

	const firstSigned = utils.serializeTransaction(first, firstSignature);
	const secondSigned = utils.serializeTransaction(second, secondSignature);

	// Send both signed transactions in a batched RPC request
	const response = await fetch('https://rpc.mevblocker.io/', {
		method: 'POST',
		body: JSON.stringify([
			{
				method: 'eth_sendRawTransaction',
				params: [firstSigned]
			},
			{
				method: 'eth_sendRawTransaction',
				params: [secondSigned]
			}
		]),
		headers: { 'Content-Type': 'application/json' }
	});
	return await response.json();
}
