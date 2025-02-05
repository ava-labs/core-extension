import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isString } from 'lodash';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import type { TotalBalanceForWallet } from '@src/background/services/balances/handlers/getTotalBalanceForWallet/models';
import { IMPORTED_ACCOUNTS_WALLET_ID } from '@src/background/services/balances/handlers/getTotalBalanceForWallet/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import type { GetTotalBalanceForWalletHandler } from '@src/background/services/balances/handlers/getTotalBalanceForWallet';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

interface WalletTotalBalanceContextProps {
  children?: React.ReactNode;
}

export type WalletTotalBalanceState = Partial<TotalBalanceForWallet> & {
  isLoading: boolean;
  hasErrorOccurred: boolean;
};

export const WalletTotalBalanceContext = createContext<{
  fetchBalanceForWallet(walletId: string): Promise<void>;
  walletBalances: Record<string, WalletTotalBalanceState>;
}>({
  walletBalances: {},
  fetchBalanceForWallet: () => Promise.resolve(),
});

export const WalletTotalBalanceProvider = ({
  children,
}: WalletTotalBalanceContextProps) => {
  const {
    accounts: { imported },
  } = useAccountsContext();
  const { wallets } = useWalletContext();
  const { request } = useConnectionContext();

  const hasImportedAccounts = useMemo(
    () => Object.keys(imported).length > 0,
    [imported],
  );

  const [walletBalances, setWalletBalances] = useState<
    Record<string, WalletTotalBalanceState>
  >({});

  const fetchBalanceForWallet = useCallback(
    async (walletId: string) => {
      setWalletBalances((prevState) => ({
        ...prevState,
        [walletId]: {
          ...prevState[walletId],
          hasErrorOccurred: false,
          isLoading: true,
        },
      }));

      request<GetTotalBalanceForWalletHandler>({
        method: ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
        params: {
          walletId,
        },
      })
        .then((walletBalanceInfo) => {
          setWalletBalances((prevState) => ({
            ...prevState,
            [walletId]: {
              ...walletBalanceInfo,
              hasErrorOccurred: false,
              isLoading: false,
            },
          }));
        })
        .catch((err) => {
          console.log('Error while fetching total balance for wallet', err);
          setWalletBalances((prevState) => ({
            ...prevState,
            [walletId]: {
              ...prevState[walletId],
              hasErrorOccurred: true,
              isLoading: false,
            },
          }));
        });
    },
    [request],
  );
  useEffect(() => {
    let isMounted = true;

    const fetchWalletBalancesSequentially = async (walletIds: string[]) => {
      for (const walletId of walletIds) {
        await fetchBalanceForWallet(walletId);
        if (!isMounted) {
          return;
        }
      }
    };

    const walletIds = [
      ...wallets.map(({ id }) => id),
      hasImportedAccounts ? IMPORTED_ACCOUNTS_WALLET_ID : undefined,
    ].filter(isString);

    fetchWalletBalancesSequentially(walletIds);

    return () => {
      isMounted = false;
    };
  }, [wallets, hasImportedAccounts, fetchBalanceForWallet]);

  return (
    <WalletTotalBalanceContext.Provider
      value={{
        walletBalances,
        fetchBalanceForWallet,
      }}
    >
      {children}
    </WalletTotalBalanceContext.Provider>
  );
};

export function useWalletTotalBalanceContext() {
  return useContext(WalletTotalBalanceContext);
}
