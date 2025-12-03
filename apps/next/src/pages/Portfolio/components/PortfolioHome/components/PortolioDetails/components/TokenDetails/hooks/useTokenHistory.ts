import { FungibleTokenBalance, Network, TxHistoryItem } from '@core/types';
import { useMemo } from 'react';
import { useAccountHistory } from '../../ActivityTab/hooks';
import { NetworkVMType, TokenType } from '@avalabs/vm-module-types';
import { useToken } from './useToken';

type Props = {
  networkId: Network['chainId'];
  tokenAddress: string;
};

const tokenMatcher = (
  tx: TxHistoryItem<NetworkVMType>,
  tokenAddress: string,
  token: FungibleTokenBalance,
) => {
  const matchedTokens = tx.tokens.filter((txToken) => {
    if (txToken.type === TokenType.NATIVE) {
      return txToken.symbol.toLowerCase() === tokenAddress.toLowerCase();
    }

    if (txToken.type === TokenType.ERC20) {
      return token.symbol.toLowerCase() === token.symbol.toLowerCase();
    }
    return false;
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
    return transactionHistory.filter((tx) =>
      tokenMatcher(tx, tokenAddress, token),
    );
  }, [transactionHistory, tokenAddress, token]);

  return filteredTransactionHistory;
};
