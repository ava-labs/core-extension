import { FungibleTokenBalance, Network, TxHistoryItem } from '@core/types';
import { useMemo } from 'react';
import { useAccountHistory } from '../../ActivityTab/hooks';
import { useToken } from './useToken';

type Props = {
  networkId: Network['chainId'];
  tokenAddress: string;
};

const tokenMatcher = (tx: TxHistoryItem, token: FungibleTokenBalance) => {
  const matchedTokens = tx.tokens.filter((txToken) => {
    return txToken.symbol?.toLowerCase() === token.symbol.toLowerCase();
  });

  return matchedTokens.length > 0;
};

export const useTokenHistory = ({
  networkId,
  tokenAddress,
}: Props): TxHistoryItem[] | null => {
  const transactionHistory = useAccountHistory(networkId);
  const token = useToken(tokenAddress, networkId);

  return useMemo(() => {
    if (transactionHistory === null) {
      return null;
    }
    if (!token) {
      return [];
    }
    return transactionHistory.filter((tx) => tokenMatcher(tx, token));
  }, [transactionHistory, token]);
};
