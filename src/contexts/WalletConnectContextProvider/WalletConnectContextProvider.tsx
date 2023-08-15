import { createContext, useCallback, useContext, useReducer } from 'react';

import {
  AccountImportState,
  AccountImportStatus,
  WalletConnectUri,
} from './models';
import { importReducer } from './importReducer';

const MOCKED_URIS = [
  'wc:d3f7af38ed484dd8e4b5be061f0e5a80aaa0f757edf881dabd9e1bfca6b17b00@2?relay-protocol=irn&symKey=98a7c19add5d9ddd57100f135d1af57478bcc8a3bff37ff9b6c763e6904b8afd',
  'wc:3440f05de786cde4e60076b748d9892a3906cffe41300d32f9836599ef04b714@2?relay-protocol=irn&symKey=1c2786ac6c4524afb1638eef617ad715ab3e25c7e04186033a9eab73c9c60984',
  'wc:3ffdcc9235a5657257a52c506d23f4a71bd592a5522a6301620a839805bd3458@2?relay-protocol=irn&symKey=6d5760864a6039c3f50590cacb1346deb79d2ec9aba2523bcd19d1adeb4cba04',
];

const WalletConnectContext = createContext<{
  importState: AccountImportState;
  initiateImport(): void;

  // TODO: remove mock* methods once we have the backend
  mockSuccess?: () => void;
  mockFailure?: () => void;
}>({
  importState: {
    status: AccountImportStatus.NotInitiated,
  },
  initiateImport() {
    return;
  },
});

export const WalletConnectContextProvider: React.FC = ({ children }) => {
  const [importState, dispatch] = useReducer(importReducer, {
    status: AccountImportStatus.NotInitiated,
  });

  const initiateImport = useCallback(() => {
    dispatch({ status: AccountImportStatus.Initiated });
    // This is mocked data just to get a feel of how the UI will work.
    // Normally, the provider will listen to events dispatched by the backend
    // and the URI will come in from there.
    setTimeout(() => {
      const index = Math.floor(Math.random() * MOCKED_URIS.length);
      const uri = MOCKED_URIS[index] as WalletConnectUri;

      dispatch({
        status: AccountImportStatus.AwaitingApproval,
        payload: { uri },
      });
    }, 500);
  }, [dispatch]);

  const mockSuccess = useCallback(() => {
    // FIXME: In reality, we'll listen to events dispatched by the background script,
    // this method here is just to allow us to test the UI, since the backend is not
    // implemented yet.
    dispatch({
      status: AccountImportStatus.Successful,
      payload: {
        accountId: 'new-account-id', // ID of the account we're supposed to switch to.
      },
    });
  }, [dispatch]);

  const mockFailure = useCallback(() => {
    // FIXME: In reality, we'll listen to events dispatched by the background script,
    // this method here is just to allow us to test the UI, since the backend is not
    // implemented yet.
    dispatch({
      status: AccountImportStatus.Failed,
      payload: {
        error: 'Example error message',
      },
    });
  }, [dispatch]);

  return (
    <WalletConnectContext.Provider
      value={{
        importState,
        initiateImport,
        mockSuccess,
        mockFailure,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};

export function useWalletConnectContext() {
  return useContext(WalletConnectContext);
}
