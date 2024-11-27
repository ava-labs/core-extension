import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetTotalBalanceForWalletHandler } from '@src/background/services/balances/handlers/getTotalBalanceForWallet';
import { TotalBalanceForWallet } from '@src/background/services/balances/handlers/getTotalBalanceForWallet/models';
import { WalletDetails } from '@src/background/services/wallet/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useEffect, useState } from 'react';

export const useWalletTotalBalance = (walletDetails?: WalletDetails) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);
  const [totalBalanceInfo, setTotalBalanceInfo] =
    useState<TotalBalanceForWallet>({
      hasBalanceOfUnknownFiatValue: false,
      hasBalanceOnUnderivedAccounts: false,
      totalBalanceInCurrency: undefined,
    });

  const { request } = useConnectionContext();

  const fetchBalance = useCallback(
    (walletId: string) =>
      request<GetTotalBalanceForWalletHandler>({
        method: ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
        params: {
          walletId,
        },
      }),
    [request]
  );

  useEffect(() => {
    if (!walletDetails?.id) {
      return;
    }

    setIsLoading(true);
    fetchBalance(walletDetails.id)
      .then((info) => {
        setHasErrorOccurred(false);
        setTotalBalanceInfo(info);
      })
      .catch((err) => {
        console.log('Error while fetching total balance for wallet', err);
        setHasErrorOccurred(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchBalance, walletDetails?.id]);

  return {
    isLoading,
    hasErrorOccurred,
    ...totalBalanceInfo,
  };
};
