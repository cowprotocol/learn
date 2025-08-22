import type { Web3Provider } from '@ethersproject/providers'

export async function run(provider: Web3Provider): Promise<unknown> {
  // TODO: Configure the EthersV5Adapter and set it as global adapter

  return {
    message: "Ready to configure adapter!"
  }
}
