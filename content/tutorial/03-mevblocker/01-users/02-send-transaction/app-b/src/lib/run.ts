import { utils } from 'ethers';
import type { Web3Provider } from '@ethersproject/providers';

export async function run(provider: Web3Provider): Promise<unknown> {
	const signer = provider.getSigner();

	const tx = {
		to: await signer.getAddress(),
		value: utils.parseEther('0.01')
	};

	// Send the transaction
	const transactionResponse = await signer.sendTransaction(tx);
	console.log(`Transaction sent! https://rpc.mevblocker.io/tx/${transactionResponse.hash}`);

	// Wait for the transaction to be included
	await transactionResponse.wait();
	console.log('Transaction confirmed');

	return `https://etherscan.io/tx/${transactionResponse.hash}`;
}
