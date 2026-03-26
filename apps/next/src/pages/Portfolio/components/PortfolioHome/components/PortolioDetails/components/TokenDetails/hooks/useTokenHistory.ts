import { getAddressForChain } from '@core/common';
import { Network, TxHistoryItem } from '@core/types';
import { useAccountsContext, useNetworkContext } from '@core/ui';
import { useMemo } from 'react';
import { useAccountHistory } from '../../ActivityTab/hooks';
import { useToken } from './useToken';
import { transactionMatchesTokenFilter } from '../utils/tokenHistoryFilter';

type Props = {
  networkId: Network['chainId'];
  tokenAddress: string;
};

export const useTokenHistory = ({
  networkId,
  tokenAddress,
}: Props): TxHistoryItem[] | null => {
  const transactionHistory = useAccountHistory(networkId);
  const token = useToken(tokenAddress, networkId);
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { getNetwork } = useNetworkContext();

  const walletAddress = useMemo(() => {
    const network = getNetwork(networkId);
    return getAddressForChain(network, activeAccount);
  }, [activeAccount, getNetwork, networkId]);

  return useMemo(() => {
    if (transactionHistory === null) {
      return null;
    }
    if (!token) {
      return [];
    }
    return transactionHistory.filter((tx) =>
      transactionMatchesTokenFilter(tx, token, walletAddress),
    );
  }, [transactionHistory, token, walletAddress]);
};
