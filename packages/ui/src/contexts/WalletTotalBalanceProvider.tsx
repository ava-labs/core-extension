import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isString } from 'lodash';

import {
  IMPORTED_ACCOUNTS_WALLET_ID,
  TotalBalanceForWallet,
  ExtensionRequest,
  TotalAtomicBalanceForWallet,
} from '@core/types';

import { GetTotalBalanceForWalletHandler } from '@core/service-worker';
import { useAccountsContext } from './AccountsProvider';
import { useWalletContext } from './WalletProvider';
import { useConnectionContext } from './ConnectionProvider';
import { GetTotalAtomicFundsForWalletHandler } from '~/services/balances/handlers/getTotalAtomicFundsForWallet';

interface WalletTotalBalanceContextProps {
  children?: React.ReactNode;
}

export type WalletTotalBalanceState = Partial<TotalBalanceForWallet> & {
  isLoading: boolean;
  hasErrorOccurred: boolean;
};

export type WalletAtomicBalanceState = Partial<TotalAtomicBalanceForWallet> & {
  isLoading: boolean;
  hasErrorOccurred: boolean;
};

const WalletTotalBalanceContext = createContext<
  | {
      fetchBalanceForWallet(walletId: string): Promise<void>;
      walletBalances: Record<string, WalletTotalBalanceState>;
      walletAtomicBalances: Record<string, WalletAtomicBalanceState>;
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

  const hasImportedAccounts = useMemo(
    () => Object.keys(imported).length > 0,
    [imported],
  );

  const [walletBalances, setWalletBalances] = useState<
    Record<string, WalletTotalBalanceState>
  >({});

  const [walletAtomicBalances, setWalletAtomicBalances] = useState<
    Record<string, WalletAtomicBalanceState>
  >({});

  const fetchAtomicBalanceForWallet = useCallback(
    async (walletId: string) => {
      setWalletBalances((prevState) => ({
        ...prevState,
        [walletId]: {
          ...prevState[walletId],
          hasErrorOccurred: false,
          isLoading: true,
        },
      }));
      request<GetTotalAtomicFundsForWalletHandler>({
        method: ExtensionRequest.GET_ATOMIC_FUNDS_FOR_WALLET,
        params: {
          walletId,
        },
      })
        .then((atomicBalance) => {
          setWalletAtomicBalances((prevState) => ({
            ...prevState,
            [walletId]: {
              balanceDisplayValue: atomicBalance.sum,
              hasErrorOccurred: false,
              isLoading: false,
            },
          }));
        })
        .catch((_err) => {
          setWalletAtomicBalances((prevState) => ({
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
        await Promise.allSettled([
          fetchBalanceForWallet(walletId),
          fetchAtomicBalanceForWallet(walletId),
        ]);
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
  }, [
    wallets,
    hasImportedAccounts,
    fetchBalanceForWallet,
    fetchAtomicBalanceForWallet,
  ]);

  return (
    <WalletTotalBalanceContext.Provider
      value={{
        walletBalances,
        fetchBalanceForWallet,
        walletAtomicBalances,
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
