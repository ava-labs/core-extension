import { ChainId } from '@avalabs/chains-sdk';
import { Account } from '@src/background/services/accounts/models';
import {
  isFireblocksAccount,
  isWalletConnectAccount,
} from '@src/background/services/accounts/utils/typeGuards';
import isFireblocksApiSupported from '@src/background/services/fireblocks/utils/isFireblocksApiSupported';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

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

interface FunctionIsAvailable {
  isFunctionAvailable: boolean;
  isReady: boolean;
  checkIsFunctionAvailable: (functionName: string) => boolean;
}
export const useIsFunctionAvailable = (
  functionName?: string
): FunctionIsAvailable => {
  const { network } = useNetworkContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const isReady = Boolean(network && active);

  const checkIsFunctionAvailable = (name: string) => {
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
      checkIsFunctionAvailable,
    };
  }
  if (checkIsFunctionAvailable(functionName)) {
    return {
      isReady,
      isFunctionAvailable: true,
      checkIsFunctionAvailable,
    };
  }
  return {
    isReady,
    isFunctionAvailable: false,
    checkIsFunctionAvailable,
  };
};
