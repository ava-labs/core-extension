import { NetworkVMType } from '@avalabs/chains-sdk';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { EthSendTransactionParams } from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { Network } from '@src/background/services/network/models';
import { EnsureDefined } from '@src/background/models';

const assertSameEnvironment = (networkA: Network, activeNetwork?: Network) => {
  if (Boolean(networkA.isTestnet) !== Boolean(activeNetwork?.isTestnet)) {
    throw ethErrors.rpc.invalidParams({
      message: 'Provided ChainID is in a different environment',
      data: { chainId: networkA.chainId },
    });
  }
};

const getTargetNetworkForTx = async (
  tx: EnsureDefined<EthSendTransactionParams, 'chainId'>,
  networkService: NetworkService,
  activeScope: string
) => {
  const { uiActiveNetwork } = networkService;

  const chainId = parseInt(tx.chainId);

  const network = await networkService.getNetwork(chainId);

  if (!network) {
    throw ethErrors.rpc.invalidParams({
      message: 'Provided ChainID is not supported',
      data: { chainId },
    });
  }

  if (network?.vmName !== NetworkVMType.EVM) {
    throw ethErrors.rpc.invalidParams({
      message: 'Provided ChainID is not supported',
      data: { chainId },
    });
  }
  assertSameEnvironment(network, uiActiveNetwork);

  const isCustomNetwork = network.chainId in networkService.customNetworks;

  // Only allow custom networks if they are also the active network for the dApp
  if (isCustomNetwork && network.caipId !== activeScope) {
    throw ethErrors.rpc.invalidParams({
      message: 'ChainID is not supported for custom networks',
      data: { chainId },
    });
  }

  return network;
};

export default getTargetNetworkForTx;
