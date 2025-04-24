import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ExtensionRequest } from '@core/service-worker';
import { useConnectionContext } from './ConnectionProvider';
import { filter } from 'rxjs';
import {
  DeviceResponseData,
  KeystoneEvent,
  DeviceRequestData,
} from '@core/service-worker';
import { SubmitKeystoneSignature } from '@core/service-worker';

const KeystoneContext = createContext<{
  txRequest?: DeviceRequestData;
  resetKeystoneRequest(): void;
  submitSignature(response: DeviceResponseData): Promise<boolean>;
}>({} as any);

export function KeystoneContextProvider({ children }: { children: any }) {
  const { request, events, tabId } = useConnectionContext();
  const [txRequest, setTxRequest] = useState<DeviceRequestData>();
  /**
   * Listen for send events to a ledger instance
   */
  useEffect(() => {
    const subscription = events<DeviceRequestData>()
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
    async (response: DeviceResponseData) =>
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
    <KeystoneContext.Provider
      value={{
        txRequest,
        resetKeystoneRequest,
        submitSignature,
      }}
    >
      {children}
    </KeystoneContext.Provider>
  );
}

export function useKeystoneContext() {
  return useContext(KeystoneContext);
}
