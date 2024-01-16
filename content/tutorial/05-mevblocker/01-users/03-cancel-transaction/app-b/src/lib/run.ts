import { utils } from 'ethers';
import type { Web3Provider } from '@ethersproject/providers';

export async function run(provider: Web3Provider): Promise<unknown> {
	const signer = provider.getSigner();

	const nonce = await signer.getTransactionCount();
	const tx = {
		to: await signer.getAddress(),
		value: utils.parseEther('0.01'),
		nonce
	};

	const cancellation = {
		to: await signer.getAddress(),
		nonce
	};

	const [transactionResponse, _] = await Promise.all([
		signer.sendTransaction(tx),
		signer.sendTransaction(cancellation)
	]);
	return `Cancellation sent! Check https://rpc.mevblocker.io/tx/${transactionResponse.hash}`;
}
