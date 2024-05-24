import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { filter, map } from 'rxjs';
import { WalletDetails } from '@src/background/services/wallet/models';
import { WalletLocked } from '@src/pages/Wallet/WalletLocked';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useLedgerContext } from './LedgerProvider';
import {
  PchainTxHistoryItem,
  TxHistoryItem,
  XchainTxHistoryItem,
} from '@src/background/services/history/models';
import { UnlockWalletHandler } from '@src/background/services/lock/handlers/unlockWalletState';
import { LockChangePasswordHandler } from '@src/background/services/lock/handlers/changeWalletPassword';
import { GetUnencryptedMnemonicHandler } from '@src/background/services/wallet/handlers/getUnencryptedMnemonic';
import { GetWalletDetailsHandler } from '@src/background/services/wallet/handlers/getWalletDetails';
import { GetHistoryHandler } from '@src/background/services/history/handlers/getHistory';
import { GetLockStateHandler } from '@src/background/services/lock/handlers/getLockState';
import { walletStateChangedEventListener } from '@src/background/services/wallet/events/WalletUpdatedEventListener';
import { lockStateChangedEventListener } from '@src/background/services/lock/events/lockStateChangedEventListener';
import { useAccountsContext } from './AccountsProvider';
import { AccountType } from '@src/background/services/accounts/models';
import { SecretType } from '@src/background/services/secrets/models';

type WalletStateAndMethods = {
  isWalletLoading: boolean;
  isWalletLocked: boolean;
  isLedgerWallet: boolean;
  walletDetails: WalletDetails | undefined;
  wallets: WalletDetails[];
  changeWalletPassword(
    newPassword: string,
    oldPassword: string
  ): Promise<boolean>;
  getWallet(id: string): WalletDetails | undefined;
  getUnencryptedMnemonic(password: string): Promise<string>;
  getTransactionHistory(): Promise<
    TxHistoryItem[] | PchainTxHistoryItem[] | XchainTxHistoryItem[]
  >;
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
    [wallets]
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
        map((evt) => evt.value)
      )
      .subscribe((locked) => {
        setIsWalletLocked(locked);
      });

    const walletSubscription = events()
      .pipe(
        filter(walletStateChangedEventListener),
        map((evt) => evt.value)
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
    [request]
  );

  const changeWalletPassword = useCallback(
    (newPassword: string, oldPassword: string) => {
      return request<LockChangePasswordHandler>({
        method: ExtensionRequest.LOCK_CHANGE_PASSWORD,
        params: [newPassword, oldPassword],
      });
    },
    [request]
  );

  const getUnencryptedMnemonic = useCallback(
    (password: string) => {
      return request<GetUnencryptedMnemonicHandler>({
        method: ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC,
        params: [password],
      });
    },
    [request]
  );

  const getTransactionHistory = useCallback(() => {
    return request<GetHistoryHandler>({
      method: ExtensionRequest.HISTORY_GET,
    });
  }, [request]);

  if (!isWalletLoading && isWalletLocked) {
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
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
