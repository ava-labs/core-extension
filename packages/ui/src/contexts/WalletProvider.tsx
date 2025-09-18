import {
  AccountType,
  DAppProviderRequest,
  ExtensionRequest,
  SecretType,
  TxHistoryItem,
  WalletDetails,
} from '@core/types';

import {
  AvalancheRenameWalletHandler,
  GetHistoryHandler,
  GetLockStateHandler,
  GetUnencryptedMnemonicHandler,
  GetWalletDetailsHandler,
  LockChangePasswordHandler,
  UnlockWalletHandler,
} from '@core/service-worker';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouteMatch } from 'react-router-dom';
import { filter, map } from 'rxjs';
import { useAccountsContext } from './AccountsProvider';
import { useConnectionContext } from './ConnectionProvider';
import { useLedgerContext } from './LedgerProvider';
import {
  isLockStateChangedEvent,
  isWalletStateUpdateEvent,
} from '@core/common';

type WalletStateAndMethods = {
  isWalletLoading: boolean;
  isWalletLocked: boolean;
  isLedgerWallet: boolean;
  walletDetails: WalletDetails | undefined;
  wallets: WalletDetails[];
  changeWalletPassword(
    newPassword: string,
    oldPassword: string,
  ): Promise<boolean>;
  getWallet(id: string): WalletDetails | undefined;
  getUnencryptedMnemonic(password: string): Promise<string>;
  getTransactionHistory(): Promise<TxHistoryItem[]>;
  renameWallet(id: string, name: string): Promise<any>;
};

const WalletContext = createContext<WalletStateAndMethods>({
  wallets: [],
} as any);

export type WalletContextProviderProps = PropsWithChildren<{
  LoadingComponent: React.FC;
  LockedComponent: React.FC<{
    unlockWallet: (password: string) => Promise<true>;
  }>;
}>;

export function WalletContextProvider({
  children,
  LockedComponent,
  LoadingComponent,
}: WalletContextProviderProps) {
  const { initLedgerTransport } = useLedgerContext();
  const { request, events } = useConnectionContext();
  const [isWalletLocked, setIsWalletLocked] = useState<boolean>(true);
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(true);
  const [walletDetails, setWalletDetails] = useState<
    WalletDetails | undefined
  >();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const [wallets, setWallets] = useState<WalletDetails[]>([]);

  const getWallet = useCallback(
    (walletId: string) => wallets.find(({ id }) => walletId === id),
    [wallets],
  );

  const isLedgerWallet = useMemo(() => {
    return (
      walletDetails?.type === SecretType.Ledger ||
      walletDetails?.type === SecretType.LedgerLive
    );
  }, [walletDetails]);

  useEffect(() => {
    if (activeAccount?.type === AccountType.PRIMARY) {
      setWalletDetails(wallets.find((w) => w.id === activeAccount.walletId));
    } else {
      setWalletDetails(undefined);
    }
  }, [activeAccount, wallets]);

  useEffect(() => {
    if (isWalletLocked) {
      setWallets([]);
      setWalletDetails(undefined);
    } else {
      request<GetWalletDetailsHandler>({
        method: ExtensionRequest.WALLET_GET_DETAILS,
      }).then((_wallets) => {
        setWallets(_wallets);
      });
    }
  }, [isWalletLocked, request]);

  // listen for wallet creation
  useEffect(() => {
    if (!request || !events) {
      return;
    }
    setIsWalletLoading(true);

    request<GetLockStateHandler>({
      method: ExtensionRequest.LOCK_GET_STATE,
    }).then((locked) => {
      setIsWalletLocked(locked);
      setIsWalletLoading(false);
    });

    const lockSubscription = events()
      .pipe(
        filter(isLockStateChangedEvent),
        map((evt) => evt.value),
      )
      .subscribe((locked) => {
        setIsWalletLocked(locked);
      });

    const walletSubscription = events()
      .pipe(
        filter(isWalletStateUpdateEvent),
        map((evt) => evt.value),
      )
      .subscribe((_wallets) => {
        setWallets(_wallets);
      });

    return () => {
      walletSubscription.unsubscribe();
      lockSubscription.unsubscribe();
    };
  }, [events, request]);

  useEffect(() => {
    if (!isWalletLocked && isLedgerWallet) {
      initLedgerTransport();
    }
  }, [initLedgerTransport, isWalletLocked, isLedgerWallet]);

  const unlockWallet = useCallback(
    (password: string) => {
      return request<UnlockWalletHandler>({
        method: ExtensionRequest.UNLOCK_WALLET,
        params: [password],
      });
    },
    [request],
  );

  const changeWalletPassword = useCallback(
    (newPassword: string, oldPassword: string) => {
      return request<LockChangePasswordHandler>({
        method: ExtensionRequest.LOCK_CHANGE_PASSWORD,
        params: [newPassword, oldPassword],
      });
    },
    [request],
  );

  const getUnencryptedMnemonic = useCallback(
    (password: string) => {
      return request<GetUnencryptedMnemonicHandler>({
        method: ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC,
        params: [password],
      });
    },
    [request],
  );

  const getTransactionHistory = useCallback(() => {
    return request<GetHistoryHandler>({
      method: ExtensionRequest.HISTORY_GET,
    });
  }, [request]);

  const renameWallet = useCallback(
    (id: string, name: string) => {
      return request<AvalancheRenameWalletHandler>({
        method: DAppProviderRequest.WALLET_RENAME,
        params: [id, name],
      });
    },
    [request],
  );

  // We do not require extension to be unlocked for wallet selection
  const routeMatch = useRouteMatch('/approve/select-wallet');
  const allowWalletSelection = routeMatch?.isExact;

  if (isWalletLoading) {
    return <LoadingComponent />;
  }

  if (isWalletLocked && !allowWalletSelection) {
    return <LockedComponent unlockWallet={unlockWallet} />;
  }

  return (
    <WalletContext.Provider
      value={{
        getWallet,
        isWalletLoading,
        isWalletLocked,
        isLedgerWallet,
        walletDetails,
        wallets,
        changeWalletPassword,
        getUnencryptedMnemonic,
        getTransactionHistory,
        renameWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
