import { getTokenPrice } from '@src/background/services/balances/models';
import { isBitcoinChainId } from '@src/background/services/network/utils/isBitcoinNetwork';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useCallback, useMemo } from 'react';

type UseTokenPriceMissingProps = {
  favoriteNetworksMissingPrice: boolean;
  activeNetworkMissingPrice: boolean;
  isPriceMissingFromNetwork: (networkId: number) => boolean;
};

export function useTokenPriceMissing(): UseTokenPriceMissingProps {
  const { tokens, isTokensCached } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network: activeNetwork, favoriteNetworks } = useNetworkContext();

  const networksMissingPrice: Record<string, boolean> = useMemo(() => {
    if (isTokensCached) {
      return {};
    }

    const networkIds = Object.keys(tokens.balances ?? {});
    if (!networkIds.length) {
      return {};
    }

    const networksIsMissingPrices = {};

    networkIds.forEach((networkId) => {
      const tokensForNetwork = tokens.balances?.[networkId];

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

      const isMissingPrices = Object.values(tokensForActiveAccount).some(
        (token) => getTokenPrice(token) === undefined
      );

      networksIsMissingPrices[networkId] = isMissingPrices;
    });

    return networksIsMissingPrices;
  }, [
    activeAccount?.addressBTC,
    activeAccount?.addressC,
    isTokensCached,
    tokens.balances,
  ]);

  const favoriteNetworksMissingPrice = useMemo(
    () =>
      favoriteNetworks.some(
        (network) => networksMissingPrice[network.chainId] === true
      ),
    [favoriteNetworks, networksMissingPrice]
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
    [networksMissingPrice]
  );

  return {
    favoriteNetworksMissingPrice,
    activeNetworkMissingPrice,
    isPriceMissingFromNetwork,
  };
}
