import { createContext, useContext, useEffect, useState } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { resolve } from '@src/utils/promiseResolver';
import { delay, filter, of, retryWhen, switchMap } from 'rxjs';
import { LedgerEvent } from '@src/background/services/ledger/events/models';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { getLedgerTransport } from '@src/contexts/utils/getLedgerTransport';
import { getAppAvax } from '@avalabs/avalanche-wallet-sdk';

export const SUPPORTED_LEDGER_VERSION = '0.5.9';
const LEDGER_INSTANCE_UUID = crypto.randomUUID();

const LedgerSupportContext = createContext<{
  popDeviceSelection(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  initLedgerTransport(): Promise<void>;
  hasLedgerTransport: boolean;
}>({} as any);

export function LedgerSupportContextProvider({ children }: { children: any }) {
  const [initialized, setInialized] = useState(false);
  const [app, setApp] = useState<any>();
  const { request, events } = useConnectionContext();

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter((evt) => evt.name === LedgerEvent.TRANSPORT_REQUEST),
        filter((evt) => evt.value.connectionUUID === LEDGER_INSTANCE_UUID)
      )
      .subscribe(async (res) => {
        if (res.value.method === 'SEND') {
          try {
            const { cla, ins, p1, p2, data, statusList } = res.value.params;
            const result = await app?.transport.send(
              cla,
              ins,
              p1,
              p2,
              Buffer.from(data),
              statusList
            );
            request({
              method: ExtensionRequest.LEDGER_RESPONSE,
              params: [
                {
                  requestId: res.value.requestId,
                  method: res.value.method,
                  result,
                },
              ],
            });
          } catch (e) {
            console.error(e);
            request({
              method: ExtensionRequest.LEDGER_RESPONSE,
              params: [
                {
                  requestId: res.value.requestId,
                  method: res.value.method,
                  error: (e as Error).message,
                },
              ],
            });
          }
        }
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [request, events, app?.transport]);

  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      request({
        method: ExtensionRequest.LEDGER_REMOVE_TRANSPORT,
        params: [LEDGER_INSTANCE_UUID],
      });
    });
  });

  useEffect(() => {
    const subscription = of([initialized, app])
      .pipe(
        filter(([initialized, app]) => initialized && !app),
        switchMap(async () => {
          const transport = await getLedgerTransport();
          if (!transport) {
            throw new Error('Ledger not connected');
          }
          const appInstance = await getAppAvax(transport);
          appInstance.transport.on('disconnect', () => {
            setApp(undefined);
          });
          return appInstance;
        }),
        retryWhen((errors) => errors.pipe(delay(2000)))
      )
      .subscribe((appInstance) => {
        setApp(appInstance);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, app]);

  /**
   *
   * @returns Promise<public key>
   */
  function getPublicKey() {
    return request({
      method: ExtensionRequest.LEDGER_GET_PUBLIC,
      params: [],
    });
  }

  /**
   * When the user plugs-in/connects their ledger for the first time a
   * device selection needs to be performed before we can do anything with
   * the device. So for those cases this function forces that popup to open.
   *
   * This cannot be opened on the popup (confirm) or popout (extension click)
   * view. This can only be performed on a tab view so the user will need to be
   * put into that state first.
   *
   * @returns The transport object
   */
  async function popDeviceSelection() {
    if (app) {
      return true;
    }
    const [hidTransport] = await resolve(TransportWebHID.request());
    if (hidTransport) {
      // if connection was successfull immeditately close it to let the background script create the connection
      await hidTransport.close();
      return true;
    }
    const [usbTransport] = await resolve(TransportWebUSB.request());
    if (usbTransport) {
      // if connection was successfull immeditately close it to let the background script create the connection
      await usbTransport.close();
      return true;
    }
    const [u2fTransport] = await resolve(TransportU2F.create());
    if (u2fTransport) {
      // if connection was successfull immeditately close it to let the background script create the connection
      await u2fTransport.close();
      return true;
    }

    throw Error('Ledger device selection failed');
  }

  async function initLedgerTransport() {
    if (initialized) {
      return;
    }
    setInialized(true);
    await request({
      method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
      params: [LEDGER_INSTANCE_UUID],
    });
  }

  if (!request || !events) {
    return <LoadingIcon />;
  }

  return (
    <LedgerSupportContext.Provider
      value={{
        popDeviceSelection,
        getPublicKey,
        initLedgerTransport,
        hasLedgerTransport: !!app,
      }}
    >
      {children}
    </LedgerSupportContext.Provider>
  );
}

export function useLedgerSupportContext() {
  return useContext(LedgerSupportContext);
}
