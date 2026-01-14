import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  KeystoneDeviceRequestData,
  KeystoneDeviceResponseData,
  ExtensionRequest,
  KeystoneEvent,
} from '@core/types';
import { SubmitKeystoneSignature } from '@core/service-worker';
import { filter } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { KeystoneUsbContextProvider } from './KeystoneUsbProvider';

const KeystoneContext = createContext<{
  txRequest?: KeystoneDeviceRequestData;
  resetKeystoneRequest(): void;
  submitSignature(response: KeystoneDeviceResponseData): Promise<boolean>;
}>({} as any);

export function KeystoneContextProvider({ children }: PropsWithChildren) {
  const { request, events, tabId } = useConnectionContext();
  const [txRequest, setTxRequest] = useState<KeystoneDeviceRequestData>();
  /**
   * Listen for send events to a ledger instance
   */
  useEffect(() => {
    const subscription = events<KeystoneDeviceRequestData>()
      .pipe(filter((evt) => evt.name === KeystoneEvent.DEVICE_REQUEST))
      .subscribe(async (res) => {
        if (res.value.tabId !== tabId) {
          return;
        }
        setTxRequest(res.value);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [request, events, tabId]);

  const submitSignature = useCallback(
    async (response: KeystoneDeviceResponseData) =>
      request<SubmitKeystoneSignature>({
        method: ExtensionRequest.KEYSTONE_SUBMIT_SIGNATURE,
        params: [response],
      }),
    [request],
  );

  const resetKeystoneRequest = useCallback(() => {
    setTxRequest(undefined);
  }, []);

  return (
    <KeystoneUsbContextProvider>
      <KeystoneContext.Provider
        value={{
          txRequest,
          resetKeystoneRequest,
          submitSignature,
        }}
      >
        {children}
      </KeystoneContext.Provider>
    </KeystoneUsbContextProvider>
  );
}

export function useKeystoneContext() {
  return useContext(KeystoneContext);
}
