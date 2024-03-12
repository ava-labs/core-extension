import { NetworkVMType } from '@avalabs/chains-sdk';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { FeatureFlagService } from '@src/background/services/featureFlags/FeatureFlagService';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { EthSendTransactionParams } from '@src/background/services/wallet/handlers/eth_sendTransaction/models';

const getTargetNetworkForTx = async (
  tx: EthSendTransactionParams,
  networkService: NetworkService,
  featureFlagService: FeatureFlagService
) => {
  const activeNetwork = networkService.activeNetwork;

  if (!tx.chainId) {
    return activeNetwork;
  }

  const chainId = parseInt(tx.chainId);

  if (networkService.isActiveNetwork(chainId)) {
    return activeNetwork;
  }

  if (
    !featureFlagService.featureFlags[
      FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT
    ]
  ) {
    throw ethErrors.rpc.invalidParams({
      message: 'Custom ChainID is not supported',
      data: { chainId },
    });
  }

  const network = await networkService.getNetwork(chainId);

  if (network?.vmName !== NetworkVMType.EVM) {
    throw ethErrors.rpc.invalidParams({
      message: 'Provided ChainID is not supported',
      data: { chainId },
    });
  }

  if (network.isTestnet !== activeNetwork?.isTestnet) {
    throw ethErrors.rpc.invalidParams({
      message: 'Provided ChainID is in a different environment',
      data: { chainId },
    });
  }

  if (networkService.customNetworks[network.chainId]) {
    throw ethErrors.rpc.invalidParams({
      message: 'ChainID is not supported for custom networks',
      data: { chainId },
    });
  }

  return network;
};

export default getTargetNetworkForTx;
