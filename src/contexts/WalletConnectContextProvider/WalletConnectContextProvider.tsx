import { filter } from 'rxjs';
import { createContext, useCallback, useContext, useReducer } from 'react';

import { WalletConnectImportAccount } from '@src/background/services/walletConnect/handlers/walletConnectImportAccount';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { isUriGeneratedEvent } from '@src/background/services/walletConnect/events/eventFilters';

import { AccountImportState, AccountImportStatus } from './models';
import { importReducer } from './importReducer';
import { useConnectionContext } from '../ConnectionProvider';

const WalletConnectContext = createContext<{
  importState: AccountImportState;
  initiateImport(reconnectionAddress?: string): void;
  reset(): void;
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
    (reconnectionAddress?: string) => {
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
        .then(() => {
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
    [request, events, tabId]
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
