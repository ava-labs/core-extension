import { Network } from '@core/types';
import { useMemo } from 'react';
import { useAccountHistory } from '../../ActivityTab/hooks';
import { TokenType, TxToken } from '@avalabs/vm-module-types';

type Props = {
  networkId: Network['chainId'];
  tokenAddress: string;
};

const tokenMatcher = (token: TxToken, tokenAddress: string) => {
  if (token.type === TokenType.NATIVE) {
    return token.symbol.toLowerCase() === tokenAddress.toLowerCase();
  }

  return (
    token.to?.address === tokenAddress || token.from?.address === tokenAddress
  );
};

export const useTokenHistory = ({ networkId, tokenAddress }: Props) => {
  const transactionHistory = useAccountHistory(networkId);

  const filteredTransactionHistory = useMemo(() => {
    return transactionHistory.filter(
      (tx) =>
        tx.tokens?.filter((token) => tokenMatcher(token, tokenAddress)).length >
        0,
    );
  }, [transactionHistory, tokenAddress]);

  return filteredTransactionHistory;
};
