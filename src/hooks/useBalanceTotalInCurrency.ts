import { Account } from '@src/background/services/accounts/models';
import { isBitcoinChainId } from '@src/background/services/network/utils/isBitcoinNetwork';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import _ from 'lodash';
import { useMemo } from 'react';

function getAddressForChain(chainId: number, account: Account) {
  return isBitcoinChainId(chainId) ? account.addressBTC : account.addressC;
}

export function useBalanceTotalInCurrency(
  account?: Account,
  onlyFavoritesAndActive = false
) {
  const { tokens } = useBalancesContext();
  const { networks, network, favoriteNetworks } = useNetworkContext();

  return useMemo(() => {
    // don't freak users out by display falsely a 0 balance when we just don't know the usd value
    if (!account || !tokens.balances || !network || networks.length === 0) {
      return null;
    }

    const chainIdsToSum = _.uniq(
      onlyFavoritesAndActive
        ? [network.chainId, ...favoriteNetworks.map((f) => f.chainId)]
        : networks.map((m) => m.chainId)
    );

    const areAllNetworksLoaded = chainIdsToSum.every((chainId) => {
      return !!tokens?.balances?.[chainId]?.[
        getAddressForChain(chainId, account)
      ]?.length;
    });

    if (!areAllNetworksLoaded) {
      return null;
    }

    return chainIdsToSum.reduce((total, network) => {
      const address = getAddressForChain(network, account);
      return (
        total +
        (tokens.balances?.[network]?.[address]?.reduce(
          (sum, token) => sum + (token.balanceUSD ?? 0),
          0
        ) || 0)
      );
    }, 0);
  }, [
    account,
    tokens,
    network,
    networks,
    onlyFavoritesAndActive,
    favoriteNetworks,
  ]);
}
