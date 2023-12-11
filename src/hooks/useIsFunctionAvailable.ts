import { ChainId } from '@avalabs/chains-sdk';
import { Account } from '@src/background/services/accounts/models';
import {
  isFireblocksAccount,
  isWalletConnectAccount,
} from '@src/background/services/accounts/utils/typeGuards';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import isFireblocksApiSupported from '@src/background/services/fireblocks/utils/isFireblocksApiSupported';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import useIsUsingSeedlessAccount from './useIsUsingSeedlessAccount';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';

export enum FunctionNames {
  BRIDGE = 'Bridge',
  BUY = 'Buy',
  COLLECTIBLES = 'COLLECTIBLES',
  DEFI = 'DeFi',
  FEATURE = 'Feature', // Default when function name is unknown or not included
  KEYSTONE = 'Keystone',
  MANAGE_TOKEN = 'ManageTokens',
  RECEIVE = 'Receive',
  SEND = 'Send',
  SWAP = 'Swap',
  SIGN = 'Sign', // This is being used  by dApp approval process
}

const FeatureFlagMap: Record<string, FeatureGates> = {
  [FunctionNames.BRIDGE]: FeatureGates.BRIDGE,
  [FunctionNames.BUY]: FeatureGates.BUY,
  [FunctionNames.DEFI]: FeatureGates.DEFI,
  [FunctionNames.KEYSTONE]: FeatureGates.KEYSTONE,
  [FunctionNames.SEND]: FeatureGates.SEND,
  [FunctionNames.SWAP]: FeatureGates.SWAP,
};

const functionRequireSigning = [
  FunctionNames.BRIDGE,
  FunctionNames.SEND,
  FunctionNames.SWAP,
  FunctionNames.SIGN,
];

// The list we want to DISABLE features on certain networks or account types (blacklist)
type ComplexCheck = (activeNetwork: ChainId, activeAccount: Account) => boolean;
type BlacklistConfig = { networks: ChainId[]; complexChecks: ComplexCheck[] };

// Disables given feature on BTC networks when:
//  - active account has no BTC address
//  - active account is imported through WalletConnect (no Bitcoin support)
//  - active account is imported from Fireblocks without BTC support
const disableForAccountsWithoutBtcSupport = (
  chain: ChainId,
  account: Account
) => {
  const isBtc = [ChainId.BITCOIN, ChainId.BITCOIN_TESTNET].includes(chain);

  if (!isBtc) {
    return false;
  }

  const hasBtcAddress = Boolean(account.addressBTC);

  return (
    !hasBtcAddress ||
    isWalletConnectAccount(account) ||
    (isFireblocksAccount(account) && !isFireblocksApiSupported(account))
  );
};

const disabledFeatures: Record<string, BlacklistConfig> = {
  ManageTokens: {
    networks: [ChainId.BITCOIN],
    complexChecks: [],
  },
  Send: {
    networks: [],
    complexChecks: [disableForAccountsWithoutBtcSupport],
  },
  Bridge: {
    networks: [
      ChainId.DFK,
      ChainId.DFK_TESTNET,
      ChainId.SWIMMER,
      ChainId.SWIMMER_TESTNET,
    ],
    complexChecks: [disableForAccountsWithoutBtcSupport],
  },
};

// The list we want to ENABLE features on certain networks (whitelist)
const enabledFeatues = {
  COLLECTIBLES: [
    ChainId.AVALANCHE_MAINNET_ID,
    ChainId.AVALANCHE_TESTNET_ID,
    ChainId.ETHEREUM_HOMESTEAD,
  ],
  Swap: [ChainId.AVALANCHE_MAINNET_ID],
  Buy: [ChainId.AVALANCHE_MAINNET_ID, ChainId.AVALANCHE_TESTNET_ID],
};

/**
 * isFunctionAvailable:
 * This is checking feature flags to see if a specific feature is currently available.
 * Also it checks if seedless signing is available if the account is seedless.
 *
 * isFunctionSupported:
 * This is checking if the function is supported on the active network.
 */
interface FunctionIsAvailable {
  isFunctionAvailable: boolean;
  isFunctionSupported: boolean;
  isReady: boolean;
  checkIsFunctionSupported: (functionName: FunctionNames) => boolean;
  checkIsFunctionAvailable: (functionName: FunctionNames) => boolean;
}

export const useIsFunctionAvailable = (
  functionName?: FunctionNames
): FunctionIsAvailable => {
  const { network } = useNetworkContext();
  const isUsingSeedlessAccount = useIsUsingSeedlessAccount();
  const { featureFlags } = useFeatureFlagContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const isReady = Boolean(network && active);

  const checkIsFunctionAvailable = (functionToCheck: FunctionNames) => {
    if (
      isUsingSeedlessAccount &&
      functionRequireSigning.includes(functionToCheck) &&
      !featureFlags[FeatureGates.SEEDLESS_SIGNING]
    ) {
      return false;
    }

    const featureFlagToCheck = FeatureFlagMap[functionToCheck];

    return featureFlagToCheck ? featureFlags[featureFlagToCheck] : true;
  };

  const checkIsFunctionSupported = (name: FunctionNames) => {
    if (!network || !active) {
      return false;
    }
    // Check whitelist
    if (
      enabledFeatues[name] &&
      !enabledFeatues[name].includes(network.chainId)
    ) {
      return false;
    }
    // Check blacklist
    const blacklist = disabledFeatures[name];

    if (blacklist) {
      const blacklistedForNetwork = blacklist.networks.includes(
        network.chainId
      );
      const blacklistedForOtherReasons = blacklist.complexChecks.some((check) =>
        check(network.chainId, active)
      );

      return !blacklistedForNetwork && !blacklistedForOtherReasons;
    }

    return true;
  };

  if (!network || !active || !functionName) {
    return {
      isReady,
      isFunctionAvailable: false,
      isFunctionSupported: false,
      checkIsFunctionSupported: checkIsFunctionSupported,
      checkIsFunctionAvailable: checkIsFunctionAvailable,
    };
  }

  return {
    isReady,
    isFunctionAvailable: checkIsFunctionAvailable(
      functionName ?? FunctionNames.FEATURE
    ),
    isFunctionSupported: checkIsFunctionSupported(functionName),
    checkIsFunctionSupported: checkIsFunctionSupported,
    checkIsFunctionAvailable: checkIsFunctionAvailable,
  };
};
