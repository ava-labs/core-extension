import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { filter, map } from 'rxjs';
import {
  isWalletLocked,
  WalletLockedState,
} from '@src/background/services/wallet/models';
import { WalletLocked } from '@src/pages/Wallet/WalletLocked';
import { walletUpdatedEventListener } from '@src/background/services/wallet/events/walletStateUpdatesListener';
import { ExtensionRequest } from '@src/background/connections/models';
import { WalletState } from '@avalabs/wallet-react-components';
import { recastWalletState } from './utils/castWalletState';
import { useLedgerSupportContext } from './LedgerSupportProvider';

type WalletStateAndMethods = WalletState & {
  changeWalletPassword(
    newPassword: string,
    oldPassword: string
  ): Promise<boolean>;
  getUnencryptedMnemonic(password: string): Promise<string>;
};
const WalletContext = createContext<WalletStateAndMethods>({} as any);

export function WalletContextProvider({ children }: { children: any }) {
  const { initLedgerTransport } = useLedgerSupportContext();
  const { request, events } = useConnectionContext();
  const [walletState, setWalletState] = useState<
    WalletState | WalletLockedState
  >();

  function setWalletStateAndCast(state: WalletState | WalletLockedState) {
    return isWalletLocked(state)
      ? setWalletState(state)
      : state && setWalletState(recastWalletState(state as WalletState));
  }

  // listen for wallet creation
  useEffect(() => {
    if (!request || !events) {
      return;
    }

    request<WalletState>({ method: ExtensionRequest.WALLET_STATE })
      .then((result) => {
        return result;
      })
      .then(setWalletStateAndCast);

    events()
      .pipe(
        filter(walletUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe(setWalletStateAndCast);
  }, [events, request]);

  useEffect(() => {
    if (!isWalletLocked(walletState) && walletState?.walletType === 'ledger') {
      initLedgerTransport();
    }
  }, [initLedgerTransport, walletState]);

  const unlockWallet = useCallback(
    (password: string) => {
      return request({
        method: ExtensionRequest.WALLET_UNLOCK_STATE,
        params: [password],
      });
    },
    [request]
  );

  const changeWalletPassword = useCallback(
    (newPassword: string, oldPassword: string) => {
      return request({
        method: ExtensionRequest.WALLET_CHANGE_PASSWORD,
        params: [newPassword, oldPassword],
      });
    },
    [request]
  );

  const getUnencryptedMnemonic = useCallback(
    (password: string) => {
      return request({
        method: ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC,
        params: [password],
      });
    },
    [request]
  );

  if (!walletState) {
    return <LoadingIcon />;
  }

  if (isWalletLocked(walletState)) {
    return <WalletLocked unlockWallet={unlockWallet} />;
  }

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        changeWalletPassword,
        getUnencryptedMnemonic,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
