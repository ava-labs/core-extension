import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  BITCOIN_NETWORK,
  FUJI_NETWORK,
} from '@src/background/services/network/models';

const disabledFeatures = {
  [BITCOIN_NETWORK.chainId]: ['COLLECTIBLES', 'Swap', 'Buy', 'ManageTokens'],
  [FUJI_NETWORK.chainId]: ['Swap'],
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
