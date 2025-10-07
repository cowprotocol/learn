import type { PublicClient, WalletClient } from 'viem'

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
  const relayerAddress = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';
  const tokenAddress = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d';

  // Compacted ABI for the approve function
  const approveAbi = [
    {
      inputs: [
        { name: '_spender', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ] as const;

  const [ownerAddress] = await walletClient.getAddresses();

	const approvalAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

  const hash = await walletClient.writeContract({
		chain: walletClient.chain,
    address: tokenAddress,
    abi: approveAbi,
    functionName: 'approve',
    args: [relayerAddress, approvalAmount],
    account: ownerAddress,
  });

  console.log('tx hash', hash);

  return { txHash: hash };
}
