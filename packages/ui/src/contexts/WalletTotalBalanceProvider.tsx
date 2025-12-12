import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { isString } from 'lodash';

import {
  IMPORTED_ACCOUNTS_WALLET_ID,
  TotalBalanceForWallet,
  ExtensionRequest,
} from '@core/types';

import { GetTotalBalanceForWalletHandler } from '@core/service-worker';
import { useAccountsContext } from './AccountsProvider';
import { useWalletContext } from './WalletProvider';
import { useConnectionContext } from './ConnectionProvider';
import { checkAndCleanupPossibleErrorForRequestInSessionStorage } from '@core/common';

interface WalletTotalBalanceContextProps {
  children?: React.ReactNode;
}

export type WalletTotalBalanceState = Partial<TotalBalanceForWallet> & {
  isLoading: boolean;
  hasErrorOccurred: boolean;
  hasBalanceServiceErrorOccurred: boolean;
};

const WalletTotalBalanceContext = createContext<
  | {
      fetchBalanceForWallet(walletId: string): Promise<void>;
      walletBalances: Record<string, WalletTotalBalanceState>;
      fetchWalletBalancesSequentially: () => Promise<void>;
    }
  | undefined
>(undefined);

export const WalletTotalBalanceProvider = ({
  children,
}: WalletTotalBalanceContextProps) => {
  const {
    accounts: { imported },
  } = useAccountsContext();
  const { wallets } = useWalletContext();
  const { request } = useConnectionContext();
  const isMounted = useRef<boolean>(false);
  const isSyncingBalances = useRef<boolean>(false);

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
          hasBalanceServiceErrorOccurred: false,
          isLoading: true,
        },
      }));

      request<GetTotalBalanceForWalletHandler>({
        method: ExtensionRequest.BALANCES_GET_TOTAL_FOR_WALLET,
        params: {
          walletId,
        },
      })
        .then(async (walletBalanceInfo) => {
          const hasBalanceServiceErrorOccurred =
            await checkAndCleanupPossibleErrorForRequestInSessionStorage(
              walletId,
            );
          setWalletBalances((prevState) => ({
            ...prevState,
            [walletId]: {
              ...walletBalanceInfo,
              hasErrorOccurred: false,
              hasBalanceServiceErrorOccurred,
              isLoading: false,
            },
          }));
        })
        .catch(async (err) => {
          console.log('Error while fetching total balance for wallet', err);
          const hasBalanceServiceErrorOccurred =
            await checkAndCleanupPossibleErrorForRequestInSessionStorage(
              walletId,
            );
          setWalletBalances((prevState) => ({
            ...prevState,
            [walletId]: {
              ...prevState[walletId],
              hasErrorOccurred: true,
              hasBalanceServiceErrorOccurred,
              isLoading: false,
            },
          }));
        });
    },
    [request],
  );

  const fetchWalletBalancesSequentially = useCallback(async () => {
    if (isSyncingBalances.current) {
      return;
    }

    isSyncingBalances.current = true;

    const walletIds = [
      ...wallets.map(({ id }) => id),
      hasImportedAccounts ? IMPORTED_ACCOUNTS_WALLET_ID : undefined,
    ].filter(isString);

    for (const walletId of walletIds) {
      await fetchBalanceForWallet(walletId);
      if (!isMounted.current) {
        return;
      }
    }

    isSyncingBalances.current = false;
  }, [wallets, hasImportedAccounts, fetchBalanceForWallet]);

  useEffect(() => {
    isMounted.current = true;

    fetchWalletBalancesSequentially();

    return () => {
      isMounted.current = false;
    };
  }, [wallets, fetchWalletBalancesSequentially]);

  return (
    <WalletTotalBalanceContext.Provider
      value={{
        walletBalances,
        fetchBalanceForWallet,
        fetchWalletBalancesSequentially,
      }}
    >
      {children}
    </WalletTotalBalanceContext.Provider>
  );
};

export function useWalletTotalBalanceContext() {
  const context = useContext(WalletTotalBalanceContext);
  if (!context) {
    throw new Error(
      'useWalletTotalBalanceContext must be used within a WalletTotalBalanceProvider',
    );
  }
  return context;
}
