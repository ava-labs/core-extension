import { ExtensionRequest } from '@src/background/connections/models';
import { useEffect, useState } from 'react';
import { useConnectionContext } from '../ConnectionProvider';
import { History } from '@avalabs/avalanche-wallet-sdk';

export interface WalletHistory {
  items: History.HistoryItemType[];
  limit: number;
}

export function useWalletHistory(params: [number]) {
  const { request } = useConnectionContext();
  const [walletHistory, setWalletHistory] = useState<WalletHistory>();

  useEffect(() => {
    if (!request) {
      return;
    }

    request({
      method: ExtensionRequest.GET_WALLET_HISTORY,
      params,
    }).then((res) => setWalletHistory(res));
  }, []);

  return walletHistory;
}
