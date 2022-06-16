import { ChainId } from '@avalabs/chains-sdk';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

// The list we want to DISABLE features on certain networks (blacklist)
const disabledFeatures = {
  ManageTokens: [ChainId.BITCOIN],
  Bridge: [
    ChainId.DFK,
    ChainId.DFK_TESTNET,
    ChainId.SWIMMER,
    ChainId.SWIMMER_TESTNET,
  ],
};

// The list we want to ENABLE features on certain networks (whitelist)
const enabledFeatues = {
  COLLECTIBLES: [ChainId.AVALANCHE_MAINNET_ID, ChainId.AVALANCHE_TESTNET_ID],
  Swap: [ChainId.AVALANCHE_MAINNET_ID],
  Buy: [ChainId.AVALANCHE_MAINNET_ID, ChainId.AVALANCHE_TESTNET_ID],
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
    if (!network) {
      return false;
    }
    if (
      enabledFeatues[functionName] &&
      !enabledFeatues[functionName].includes(network.chainId)
    ) {
      return false;
    }
    if (
      disabledFeatures[functionName] &&
      disabledFeatures[functionName].includes(network.chainId)
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
