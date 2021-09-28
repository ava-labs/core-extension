import { TransactionSendType } from '@src/pages/Send/models';
import { useHistory, useLocation } from 'react-router-dom';

export function useSetTokenInParams() {
  const { pathname } = useLocation();
  const history = useHistory();

  return (symbol: string, type: TransactionSendType) =>
    history.push({
      pathname: pathname,
      search: `?${new URLSearchParams({
        token: symbol,
        type,
      }).toString()}`,
    });
}
