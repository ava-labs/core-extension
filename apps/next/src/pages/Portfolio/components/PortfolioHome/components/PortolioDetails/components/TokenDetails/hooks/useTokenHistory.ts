import { FungibleTokenBalance, Network, TxHistoryItem } from '@core/types';
import { useMemo } from 'react';
import { useAccountHistory } from '../../ActivityTab/hooks';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { useToken } from './useToken';

type Props = {
  networkId: Network['chainId'];
  tokenAddress: string;
};

const tokenMatcher = (
  tx: TxHistoryItem<NetworkVMType>,
  token: FungibleTokenBalance,
) => {
  const matchedTokens = tx.tokens.filter((txToken) => {
    return txToken.symbol.toLowerCase() === token.symbol.toLowerCase();
  });

  return matchedTokens.length > 0;
};

export const useTokenHistory = ({ networkId, tokenAddress }: Props) => {
  const transactionHistory = useAccountHistory(networkId);
  const token = useToken(tokenAddress, networkId);

  const filteredTransactionHistory = useMemo(() => {
    if (!token) {
      return [];
    }
    return transactionHistory?.filter((tx) => tokenMatcher(tx, token)) ?? [];
  }, [transactionHistory, token]);

  return filteredTransactionHistory;
};
