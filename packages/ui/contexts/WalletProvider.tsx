import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useConnectionContext } from './ConnectionProvider';
import { filter, map } from 'rxjs';
import { WalletDetails } from '@core/service-worker';
import { WalletLocked } from 'packages/ui/pages/Wallet/WalletLocked';
import { ExtensionRequest } from '@core/service-worker';
import { useLedgerContext } from './LedgerProvider';
import { TxHistoryItem } from '@core/service-worker';
import { UnlockWalletHandler } from '@core/service-worker';
import { LockChangePasswordHandler } from '@core/service-worker';
import { GetUnencryptedMnemonicHandler } from '@core/service-worker';
import { GetWalletDetailsHandler } from '@core/service-worker';
import { GetHistoryHandler } from '@core/service-worker';
import { GetLockStateHandler } from '@core/service-worker';
import { walletStateChangedEventListener } from '@core/service-worker';
import { lockStateChangedEventListener } from '@core/service-worker';
import { useAccountsContext } from './AccountsProvider';
import { AccountType } from '@core/service-worker';
import { SecretType } from '@core/service-worker';
import { AvalancheRenameWalletHandler } from '@core/service-worker';
import { DAppProviderRequest } from '@core/service-worker';

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

export function WalletContextProvider({ children }: { children: any }) {
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

  // listen for wallet creation
  useEffect(() => {
    if (!request || !events) {
      return;
    }
    setIsWalletLoading(true);
    request<GetWalletDetailsHandler>({
      method: ExtensionRequest.WALLET_GET_DETAILS,
    }).then((_wallets) => {
      setWallets(_wallets);
    });

    request<GetLockStateHandler>({
      method: ExtensionRequest.LOCK_GET_STATE,
    }).then((locked) => {
      setIsWalletLocked(locked);
      setIsWalletLoading(false);
    });

    const lockSubscription = events()
      .pipe(
        filter(lockStateChangedEventListener),
        map((evt) => evt.value),
      )
      .subscribe((locked) => {
        setIsWalletLocked(locked);
      });

    const walletSubscription = events()
      .pipe(
        filter(walletStateChangedEventListener),
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

  if (!isWalletLoading && isWalletLocked && !allowWalletSelection) {
    return <WalletLocked unlockWallet={unlockWallet} />;
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
