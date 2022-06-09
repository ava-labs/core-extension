import { ChainId } from '@avalabs/chains-sdk';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

const bitcoin_disabled_features = [
  'COLLECTIBLES',
  'Swap',
  'Buy',
  'ManageTokens',
];
const disabledFeatures = {
  [ChainId.BITCOIN]: bitcoin_disabled_features,
  [ChainId.BITCOIN_TESTNET]: bitcoin_disabled_features,
  [ChainId.AVALANCHE_TESTNET_ID]: ['Swap'],
};

const exclusiveFeatues = {
  COLLECTIBLES: [
    ChainId.AVALANCHE_MAINNET_ID,
    ChainId.AVALANCHE_LOCAL_ID,
    ChainId.AVALANCHE_TESTNET_ID,
  ],
};

interface FunctionIsAvailable {
  isFunctionAvailable: boolean;
  checkIsFunctionAvailable: (functionName: string) => boolean;
}
export const useIsFunctionAvailable = (
  functionName?: string
): FunctionIsAvailable => {
  const { network } = useNetworkContext();

  const checkIsFunctionAvailable = (functionName: string) => {
    if (
      network &&
      exclusiveFeatues[functionName] &&
      !exclusiveFeatues[functionName].includes(network.chainId)
    ) {
      return false;
    }
    if (
      network &&
      disabledFeatures[network.chainId] &&
      disabledFeatures[network.chainId].includes(functionName)
    ) {
      return false;
    }
    return true;
  };

  if (!network || !functionName) {
    return {
      isFunctionAvailable: false,
      checkIsFunctionAvailable,
    };
  }
  if (checkIsFunctionAvailable(functionName)) {
    return {
      isFunctionAvailable: true,
      checkIsFunctionAvailable,
    };
  }
  return {
    isFunctionAvailable: false,
    checkIsFunctionAvailable,
  };
};
