import { createSolanaRpc, devnet, mainnet } from '@solana/kit';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

export const getSolanaProvider = (network: NetworkWithCaipId) => {
  if (network.vmName !== NetworkVMType.SVM) {
    throw new Error('Network is not a Solana network');
  }

  const rpcUrl = network.isTestnet
    ? 'https://api.devnet.solana.com' // NowNodes does not support Solana Devnet
    : `${process.env.PROXY_URL}/proxy/nownodes/sol`;

  return createSolanaRpc(network.isTestnet ? devnet(rpcUrl) : mainnet(rpcUrl));
};
