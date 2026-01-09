import { useMemo } from 'react';
import {
  BalancesState,
  useBalancesContext,
  useNetworkContext,
} from '../contexts';
import { useAccountsContext } from '../contexts';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { Account, NetworkWithCaipId } from '@core/types';
import { getAddressForChain } from '@core/common';

interface GetCollectiblesForNetworkParams {
  network: NetworkWithCaipId;
  account: Account;
  balances: BalancesState;
}

const getCollectiblesForNetwork = ({
  network,
  account,
  balances,
}: GetCollectiblesForNetworkParams): NftTokenWithBalance[] => {
  const userAddress = getAddressForChain(network, account);
  if (!userAddress) {
    return [];
  }
  return Object.values(balances.nfts?.[network.chainId]?.[userAddress] ?? {});
};

export const useNfts = (network?: NetworkWithCaipId) => {
  const { balances } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { networks } = useNetworkContext();

  return useMemo<{
    collectibles: NftTokenWithBalance[];
    loading: boolean;
    error: string | undefined;
  }>(() => {
    if (!balances.nfts || !activeAccount) {
      return {
        collectibles: [],
        loading: balances.nftsLoading,
        error: balances.error,
      };
    }

    if (network) {
      return {
        collectibles: getCollectiblesForNetwork({
          account: activeAccount,
          network,
          balances,
        }),

        loading: balances.nftsLoading,
        error: balances.error,
      };
    }

    const collectiblesOnAllNetwork = networks.flatMap((enabledNetwork) =>
      getCollectiblesForNetwork({
        network: enabledNetwork,
        account: activeAccount,
        balances,
      }),
    );
    return {
      collectibles: collectiblesOnAllNetwork,
      loading: balances.nftsLoading,
      error: balances.error,
    };
  }, [network, networks, balances, activeAccount]);
};
