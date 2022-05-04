import { useNetworkContext } from '@src/contexts/NetworkProvider';

/**
 * TODO: @link https://ava-labs.atlassian.net/browse/CP-1938
 */
const disabledFeatures = {
  btc: ['COLLECTIBLES', 'Swap', 'Buy', 'ManageTokens'],
  '0xa869': ['Swap'], // FUJI network
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
