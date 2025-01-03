import { isBitcoinChainId } from '@src/background/services/network/utils/isBitcoinNetwork';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useCallback, useMemo } from 'react';

type UseTokenPriceMissingProps = {
  favoriteNetworksMissingPrice: boolean;
  activeNetworkMissingPrice: boolean;
  isPriceMissingFromNetwork: (networkId: number) => boolean;
};

export function useTokenPriceMissing(): UseTokenPriceMissingProps {
  const { balances, isTokensCached } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network: activeNetwork, favoriteNetworks } = useNetworkContext();
  const { getTokenVisibility } = useSettingsContext();

  const networksMissingPrice: Record<string, boolean> = useMemo(() => {
    if (isTokensCached) {
      return {};
    }

    const networkIds = Object.keys(balances.tokens ?? {});
    if (!networkIds.length) {
      return {};
    }

    const networksIsMissingPrices = {};

    networkIds.forEach((networkId) => {
      const tokensForNetwork = balances.tokens?.[networkId];

      // If the network does not have any tokens with balance do nothing,
      if (!tokensForNetwork) {
        return;
      }

      const addressToCheck = isBitcoinChainId(Number(networkId))
        ? activeAccount?.addressBTC
        : activeAccount?.addressC;

      // If an address to check is not available, do nothing.
      if (!addressToCheck) {
        return;
      }

      const tokensForActiveAccount = tokensForNetwork[addressToCheck];

      // If tokens for active account not available, do nothing.
      if (!tokensForActiveAccount) {
        return;
      }
      const isMissingPrices = Object.values(tokensForActiveAccount)
        .filter(getTokenVisibility) // Disregard hidden tokens
        .some(
          (token) => token.balance > 0n && token.priceInCurrency === undefined, // Only look at tokens that actually have some balance
        );

      networksIsMissingPrices[networkId] = isMissingPrices;
    });

    return networksIsMissingPrices;
  }, [
    activeAccount?.addressBTC,
    activeAccount?.addressC,
    isTokensCached,
    balances.tokens,
    getTokenVisibility,
  ]);

  const favoriteNetworksMissingPrice = useMemo(
    () =>
      favoriteNetworks.some(
        (network) => networksMissingPrice[network.chainId] === true,
      ),
    [favoriteNetworks, networksMissingPrice],
  );

  const activeNetworkMissingPrice = useMemo(() => {
    if (!activeNetwork?.chainId) {
      return false;
    }
    return networksMissingPrice[activeNetwork.chainId] === true;
  }, [activeNetwork?.chainId, networksMissingPrice]);

  const isPriceMissingFromNetwork = useCallback(
    (networkId: number) => {
      return networksMissingPrice[networkId] === true;
    },
    [networksMissingPrice],
  );

  return {
    favoriteNetworksMissingPrice,
    activeNetworkMissingPrice,
    isPriceMissingFromNetwork,
  };
}
