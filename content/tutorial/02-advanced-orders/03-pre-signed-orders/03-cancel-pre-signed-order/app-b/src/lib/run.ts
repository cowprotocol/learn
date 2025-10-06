import type { WalletClient, PublicClient } from 'viem'
import { encodeFunctionData } from 'viem'
import {
  SupportedChainId,
  COW_PROTOCOL_SETTLEMENT_CONTRACT_ADDRESS
} from '@cowprotocol/cow-sdk'
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { ethers } from 'ethers'

export async function run(walletClient: WalletClient, publicClient: PublicClient): Promise<unknown> {
  const chainId = await publicClient.getChainId();
  if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
      await walletClient.switchChain({ id: SupportedChainId.GNOSIS_CHAIN });
  }
  const [ownerAddress] = await walletClient.getAddresses();

  // Create a bridge for Safe SDK which still needs ethers
  const walletClientToSigner = (walletClient: WalletClient) => {
    const account = walletClient.account;
    if (!account) throw new Error('No account in wallet client');

    return {
      getAddress: async () => account.address,
      signMessage: async (message: string | Uint8Array) => {
        return await walletClient.signMessage({
          account,
          message: typeof message === 'string' ? message : { raw: message }
        });
      }
    };
  }

  const signer = walletClientToSigner(walletClient) as any;

  const abi = [
    {
      "inputs": [
        { "internalType": "bytes", "name": "orderUid", "type": "bytes" },
        { "internalType": "bool", "name": "signed", "type": "bool" }
      ],
      "name": "setPreSignature",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
 
  const SAFE_TRANSACTION_SERVICE_URL: Record<SupportedChainId, string> = {
    [SupportedChainId.MAINNET]: 'https://safe-transaction-mainnet.safe.global',
    [SupportedChainId.GNOSIS_CHAIN]: 'https://safe-transaction-gnosis-chain.safe.global',
    [SupportedChainId.SEPOLIA]: 'https://safe-transaction-sepolia.safe.global',
  }
  
  const getSafeSdkAndKit = async (safeAddress: string) => {
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer })
    const txServiceUrl = SAFE_TRANSACTION_SERVICE_URL[chainId]
    const safeApiKit = new SafeApiKit({ txServiceUrl, ethAdapter })
  
    const safeSdk = await Safe.create({ethAdapter, safeAddress});

    return { safeApiKit, safeSdk }
  }

  const proposeSafeTx = async (params: MetaTransactionData) => {
    const safeTx = await safeSdk.createTransaction({safeTransactionData: params})
    const signedSafeTx = await safeSdk.signTransaction(safeTx)
    const safeTxHash = await safeSdk.getTransactionHash(signedSafeTx)
    const senderSignature = signedSafeTx.signatures.get(ownerAddress.toLowerCase())?.data || ''
  
    // Send the pre-signed transaction to the Safe
    await safeApiKit.proposeTransaction({
      safeAddress,
      safeTransactionData: signedSafeTx.data,
      safeTxHash,
      senderAddress: ownerAddress,
      senderSignature,
    })

    return { safeTxHash, senderSignature }
  }

  const safeAddress = '0x075E706842751c28aAFCc326c8E7a26777fe3Cc2'
  const settlementAddress = COW_PROTOCOL_SETTLEMENT_CONTRACT_ADDRESS[chainId]

  const { safeApiKit, safeSdk } = await getSafeSdkAndKit(safeAddress)

  const orderUid = '0x83b53f9252440ca4b5e78dbbff309c90149cd4789efcef5128685c8ac35d3f8d075e706842751c28aafcc326c8e7a26777fe3cc2659ae2e7';

  const presignCallData = encodeFunctionData({
    abi: abi,
    functionName: 'setPreSignature',
    args: [orderUid, false]
  })

  const presignRawTx: MetaTransactionData = {
    to: settlementAddress,
    value: '0',
    data: presignCallData,
  }

  const { safeTxHash, senderSignature } = await proposeSafeTx(presignRawTx)

  return { orderUid, safeTxHash, senderSignature }
}
