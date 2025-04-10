import { filter } from 'rxjs';
import { createContext, useCallback, useContext, useReducer } from 'react';

import { WalletConnectImportAccount } from 'packages/service-worker/src/services/walletConnect/handlers/walletConnectImportAccount';
import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';
import { isUriGeneratedEvent } from 'packages/service-worker/src/services/walletConnect/events/eventFilters';

import {
  AccountImportState,
  AccountImportStatus,
  OnConnectCallback,
} from './models';
import { importReducer } from './importReducer';
import { useConnectionContext } from '../ConnectionProvider';

const WalletConnectContext = createContext<{
  importState: AccountImportState;
  initiateImport(
    reconnectionAddress?: string,
    onConnected?: OnConnectCallback,
  ): void;
  reset(): void;
  appName?: string;
}>({
  importState: {
    status: AccountImportStatus.NotInitiated,
  },
  initiateImport() {
    return;
  },
  reset() {
    return;
  },
});

export const WalletConnectContextProvider: React.FC = ({ children }) => {
  const { events, request, tabId } = useConnectionContext();
  const [importState, dispatch] = useReducer(importReducer, {
    status: AccountImportStatus.NotInitiated,
  });

  const reset = useCallback(() => {
    dispatch({ status: AccountImportStatus.NotInitiated });
  }, []);

  const initiateImport = useCallback(
    (reconnectionAddress?: string, onConnected?: OnConnectCallback) => {
      const qrCodeSubscription = events()
        .pipe(filter(isUriGeneratedEvent))
        .subscribe(async ({ value }) => {
          if (value.tabId !== tabId) {
            return;
          }

          dispatch({
            status: AccountImportStatus.AwaitingApproval,
            payload: { uri: value.uri },
          });
        });

      dispatch({ status: AccountImportStatus.Initiated });

      request<WalletConnectImportAccount>({
        method: ExtensionRequest.WALLET_CONNECT_IMPORT_ACCOUNT,
        params: [reconnectionAddress],
      })
        .then((result) => {
          onConnected?.(result);
          dispatch({
            status: AccountImportStatus.Successful,
          });
        })
        .catch((err) => {
          dispatch({
            status: AccountImportStatus.Failed,
            payload: {
              error: err,
            },
          });
        })
        .finally(() => {
          qrCodeSubscription.unsubscribe();
        });
    },
    [request, events, tabId],
  );

  return (
    <WalletConnectContext.Provider
      value={{
        importState,
        reset,
        initiateImport,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};

export function useWalletConnectContext() {
  return useContext(WalletConnectContext);
}
