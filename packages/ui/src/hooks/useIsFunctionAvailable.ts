import { useAccountsContext } from '../contexts';
import { useFeatureFlagContext } from '../contexts';
import { useNetworkContext } from '../contexts';
import { ChainId } from '@avalabs/core-chains-sdk';
import { Account, FeatureGates } from '@core/types';
import {
  isAvalancheNetwork,
  isBitcoinNetwork,
  isEthereumNetwork,
  isFireblocksAccount,
  isFireblocksApiSupported,
  isPchainNetwork,
  isPchainNetworkId,
  isSolanaNetwork,
  isWalletConnectAccount,
  isXchainNetwork,
  isXchainNetworkId,
} from '@core/common';
import { useIsUsingSeedlessAccount } from './useIsUsingSeedlessAccount';

export enum FunctionNames {
  BRIDGE = 'Bridge',
  BUY = 'Buy',
  COLLECTIBLES = 'COLLECTIBLES',
  DEFI = 'DeFi',
  FEATURE = 'Feature', // Default when function name is unknown or not included
  KEYSTONE = 'Keystone',
  MANAGE_TOKEN = 'ManageTokens',
  MANAGE_COLLECTIBLES = 'ManageCollectibles',
  RECEIVE = 'Receive',
  SEND = 'Send',
  SWAP = 'Swap',
  SIGN = 'Sign', // This is being used  by dApp approval process
  TOKEN_DETAILS = 'TokenDetails',
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
  account: Account,
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

// Disables given feature on PVM network when:
//  - active account has no XP address
//  - active account is imported through WalletConnect (no XP support)
//  - active account is imported from Fireblocks
const disableForAccountsWithoutXPSupport = (
  chain: ChainId,
  account: Account,
) => {
  const isPChain = isPchainNetworkId(chain);
  const isXChain = isXchainNetworkId(chain);

  if (!isPChain && !isXChain) {
    return false;
  }

  const hasPAddress = Boolean(account.addressPVM);
  const hasXAddress = Boolean(account.addressAVM);

  return (
    (isPChain && !hasPAddress) ||
    (isXChain && !hasXAddress) ||
    isWalletConnectAccount(account) ||
    isFireblocksAccount(account)
  );
};

const disabledFeatures: Record<string, BlacklistConfig> = {
  ManageTokens: {
    networks: [
      ChainId.BITCOIN,
      ChainId.AVALANCHE_P,
      ChainId.AVALANCHE_TEST_P,
      ChainId.AVALANCHE_X,
      ChainId.AVALANCHE_TEST_X,
    ],
    complexChecks: [],
  },
  ManageCollectibles: {
    networks: [
      ChainId.BITCOIN,
      ChainId.AVALANCHE_P,
      ChainId.AVALANCHE_TEST_P,
      ChainId.AVALANCHE_X,
      ChainId.AVALANCHE_TEST_X,
    ],
    complexChecks: [],
  },
  Receive: {
    networks: [],
    complexChecks: [
      disableForAccountsWithoutBtcSupport,
      disableForAccountsWithoutXPSupport,
    ],
  },
  Send: {
    networks: [],
    complexChecks: [
      disableForAccountsWithoutBtcSupport,
      disableForAccountsWithoutXPSupport,
    ],
  },
  Bridge: {
    networks: [
      ChainId.AVALANCHE_P,
      ChainId.AVALANCHE_TEST_P,
      ChainId.AVALANCHE_X,
      ChainId.AVALANCHE_TEST_X,
      ChainId.DFK,
      ChainId.DFK_TESTNET,
      ChainId.SWIMMER,
      ChainId.SWIMMER_TESTNET,
      ChainId.SOLANA_MAINNET_ID,
      ChainId.SOLANA_TESTNET_ID,
      ChainId.SOLANA_DEVNET_ID,
    ],
    complexChecks: [disableForAccountsWithoutBtcSupport],
  },
};

// The list we want to ENABLE features on certain networks (whitelist)
const enabledFeatures = {
  COLLECTIBLES: [
    ChainId.AVALANCHE_MAINNET_ID,
    ChainId.AVALANCHE_TESTNET_ID,
    ChainId.ETHEREUM_HOMESTEAD,
  ],
  Swap: [
    ChainId.AVALANCHE_MAINNET_ID,
    ChainId.ETHEREUM_HOMESTEAD,
    ChainId.SOLANA_MAINNET_ID,
  ],
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
  functionName?: FunctionNames,
): FunctionIsAvailable => {
  const { network } = useNetworkContext();
  const isUsingSeedlessAccount = useIsUsingSeedlessAccount();
  const { isFlagEnabled } = useFeatureFlagContext();

  const {
    accounts: { active },
  } = useAccountsContext();

  const isReady = Boolean(network && active);

  const checkIsFunctionAvailable = (functionToCheck: FunctionNames) => {
    if (
      isUsingSeedlessAccount &&
      functionRequireSigning.includes(functionToCheck) &&
      !isFlagEnabled(FeatureGates.SEEDLESS_SIGNING)
    ) {
      return false;
    }
    if (functionToCheck === FunctionNames.SEND) {
      if (isPchainNetwork(network)) {
        return Boolean(
          !!active?.addressPVM &&
            isFlagEnabled(FeatureGates.SEND) &&
            isFlagEnabled(FeatureGates.SEND_P_CHAIN),
        );
      } else if (isXchainNetwork(network)) {
        return Boolean(
          !!active?.addressAVM &&
            isFlagEnabled(FeatureGates.SEND) &&
            isFlagEnabled(FeatureGates.SEND_X_CHAIN),
        );
      }
    }

    if (functionToCheck === FunctionNames.SWAP) {
      if (!network || !isFlagEnabled(FeatureGates.SWAP)) {
        return false;
      }

      return isEthereumNetwork(network)
        ? isFlagEnabled(FeatureGates.SWAP_ETHEREUM)
        : isAvalancheNetwork(network)
          ? isFlagEnabled(FeatureGates.SWAP_C_CHAIN)
          : isSolanaNetwork(network)
            ? isFlagEnabled(FeatureGates.SWAP_SOLANA)
            : false;
    }

    if (functionToCheck === FunctionNames.BRIDGE) {
      if (!network || !isFlagEnabled(FeatureGates.BRIDGE)) {
        return false;
      }

      if (isBitcoinNetwork(network)) {
        return isFlagEnabled(FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA);
      }
      return true;
    }

    const featureFlagToCheck = FeatureFlagMap[functionToCheck];

    return featureFlagToCheck ? isFlagEnabled(featureFlagToCheck) : true;
  };

  const checkIsFunctionSupported = (name: FunctionNames) => {
    if (!network || !active) {
      return false;
    }

    //The avalanche Ledger app doesn’t suprort send on x/p chain yet
    //The account without addressPVM cannot send on pchain
    const onPchainWithNoAccess = isPchainNetwork(network) && !active.addressPVM;

    //The account without addressAVM cannot send on xchain
    const onXchainWithNoAccress =
      isXchainNetwork(network) && !active.addressAVM;

    if (
      name === FunctionNames.SEND &&
      (onPchainWithNoAccess || onXchainWithNoAccress)
    ) {
      return false;
    }
    // Check whitelist
    if (
      enabledFeatures[name] &&
      !enabledFeatures[name].includes(network.chainId)
    ) {
      return false;
    }
    // Check blacklist
    const blacklist = disabledFeatures[name];

    if (blacklist) {
      const blacklistedForNetwork = blacklist.networks.includes(
        network.chainId,
      );
      const blacklistedForOtherReasons = blacklist.complexChecks.some((check) =>
        check(network.chainId, active),
      );

      return !blacklistedForNetwork && !blacklistedForOtherReasons;
    }

    return true;
  };

  if (!functionName) {
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
      functionName ?? FunctionNames.FEATURE,
    ),
    isFunctionSupported: checkIsFunctionSupported(functionName),
    checkIsFunctionSupported: checkIsFunctionSupported,
    checkIsFunctionAvailable: checkIsFunctionAvailable,
  };
};
