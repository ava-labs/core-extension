import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { filter, map } from 'rxjs';
import { WalletType } from '@src/background/services/wallet/models';
import { WalletLocked } from '@src/pages/Wallet/WalletLocked';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useLedgerContext } from './LedgerProvider';
import { TxHistoryItem } from '@src/background/services/history/models';
import { lockStateChangedEventListener } from '@src/background/services/lock/events/lockStateChangedEventListener';
import { UnlockWalletHandler } from '@src/background/services/lock/handlers/unlockWalletState';
import { LockChangePasswordHandler } from '@src/background/services/lock/handlers/changeWalletPassword';
import { GetUnencryptedMnemonicHandler } from '@src/background/services/wallet/handlers/getUnencryptedMnemonic';
import { GetWalletTypeHandler } from '@src/background/services/wallet/handlers/getWalletType';
import { GetHistoryHandler } from '@src/background/services/history/handlers/getHistory';
import { GetLockStateHandler } from '@src/background/services/lock/handlers/getLockState';

type WalletStateAndMethods = {
  isWalletLoading: boolean;
  isWalletLocked: boolean;
  walletType: WalletType | undefined;
  changeWalletPassword(
    newPassword: string,
    oldPassword: string
  ): Promise<boolean>;
  getUnencryptedMnemonic(password: string): Promise<string>;
  getTransactionHistory(): Promise<TxHistoryItem[]>;
};
const WalletContext = createContext<WalletStateAndMethods>({} as any);

export function WalletContextProvider({ children }: { children: any }) {
  const { initLedgerTransport } = useLedgerContext();
  const { request, events } = useConnectionContext();
  const [walletType, setWalletType] = useState<WalletType | undefined>();
  const [isWalletLocked, setIsWalletLocked] = useState<boolean>(true);
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(true);

  // listen for wallet creation
  useEffect(() => {
    if (!request || !events) {
      return;
    }
    setIsWalletLoading(true);
    request<GetWalletTypeHandler>({
      method: ExtensionRequest.WALLET_GET_TYPE,
    }).then(setWalletType);

    request<GetLockStateHandler>({
      method: ExtensionRequest.LOCK_GET_STATE,
    }).then((locked) => {
      setIsWalletLocked(locked);
      setIsWalletLoading(false);
    });

    const subscription = events()
      .pipe(
        filter(lockStateChangedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((locked) => {
        setIsWalletLocked(locked);

        // update wallet type when the extension gets unlocked
        if (!locked) {
          request<GetWalletTypeHandler>({
            method: ExtensionRequest.WALLET_GET_TYPE,
          }).then(setWalletType);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  useEffect(() => {
    if (!isWalletLocked && walletType === WalletType.LEDGER) {
      initLedgerTransport();
    }
  }, [initLedgerTransport, isWalletLocked, walletType]);

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
        isWalletLoading,
        isWalletLocked,
        walletType,
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
