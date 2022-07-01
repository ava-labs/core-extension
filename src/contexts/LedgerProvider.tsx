import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { resolve } from '@src/utils/promiseResolver';
import {
  delay,
  filter,
  fromEventPattern,
  of,
  retryWhen,
  switchMap,
  tap,
} from 'rxjs';
import { getLedgerTransport } from '@src/contexts/utils/getLedgerTransport';
import AppAvax from '@obsidiansystems/hw-app-avalanche';
import Btc from '@ledgerhq/hw-app-btc';
import Transport from '@ledgerhq/hw-transport';
import { ledgerDiscoverTransportsEventListener } from '@src/background/services/ledger/events/ledgerDiscoverTransportsEventListener';
import { LedgerEvent } from '@src/background/services/ledger/models';
import Eth from '@ledgerhq/hw-app-eth';

export enum LedgerAppType {
  AVALANCHE = 'Avalanche',
  BITCOIN = 'Bitcoin',
  ETHEREUM = 'Ethereum',
  UNKNOWN = 'UNKNOWN',
}
export const SUPPORTED_LEDGER_VERSION = '0.5.9';
const LEDGER_INSTANCE_UUID = crypto.randomUUID();

const LedgerContext = createContext<{
  popDeviceSelection(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  initLedgerTransport(): Promise<void>;
  hasLedgerTransport: boolean;
  appType: LedgerAppType;
}>({} as any);

export function LedgerContextProvider({ children }: { children: any }) {
  const [initialized, setInialized] = useState(false);
  const [app, setApp] = useState<Btc | AppAvax | Eth>();
  const [appType, setAppType] = useState<LedgerAppType>(LedgerAppType.UNKNOWN);
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
  }, [request, events, app]);

  useEffect(() => {
    const subscription = events()
      .pipe(filter(ledgerDiscoverTransportsEventListener))
      .subscribe(() => {
        if (initialized) {
          request({
            method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
            params: [LEDGER_INSTANCE_UUID],
          });
        }
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [events, initialized, request]);

  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      request({
        method: ExtensionRequest.LEDGER_REMOVE_TRANSPORT,
        params: [LEDGER_INSTANCE_UUID],
      });
    });
  }, [request]);

  const initLedgerApp = useCallback(
    async (transport?: Transport | null): Promise<Btc | AppAvax | Eth> => {
      if (!transport) {
        throw new Error('Ledger not connected');
      }

      // first try to get the avalanche App instance
      const avaxAppInstance = new AppAvax(transport, 'w0w');
      if (avaxAppInstance) {
        // double check it's really the avalanche app
        // other apps also initialize with AppAvax
        const [, appVersionError] = await resolve(
          avaxAppInstance.getAppConfiguration()
        );

        if (!appVersionError) {
          setApp(avaxAppInstance);
          setAppType(LedgerAppType.AVALANCHE);
          return avaxAppInstance;
        }
      }

      // check if ethererum is selected
      const ethAppInstance = new Eth(transport, 'w0w');
      if (ethAppInstance) {
        // double check it's really the ethereum app
        // other apps also initialize with Eth
        const [, appVersionError] = await resolve(
          ethAppInstance.getAppConfiguration()
        );

        if (!appVersionError) {
          setApp(ethAppInstance);
          setAppType(LedgerAppType.ETHEREUM);
          return ethAppInstance;
        }
      }

      // check if btc app is selected
      const btcAppInstance = new Btc(transport);
      if (btcAppInstance) {
        const [, publicKeyError] = await resolve(
          // double check the app is really working
          // We are not doing anything with the key
          btcAppInstance.getWalletPublicKey("44'/0'/0'/0/0")
        );

        if (!publicKeyError) {
          setApp(btcAppInstance);
          setAppType(LedgerAppType.BITCOIN);
          return btcAppInstance;
        }
      }

      throw new Error('No compatible ledger app found');
    },
    []
  );

  useEffect(() => {
    const subscription = of([initialized])
      .pipe(
        filter(([initialized]) => !!initialized),
        switchMap(() => getLedgerTransport()),
        switchMap((transport) => initLedgerApp(transport)),
        switchMap((ledgerApp) =>
          fromEventPattern(
            (handler) => {
              ledgerApp?.transport.on('disconnect', handler);
            },
            (handler) => {
              ledgerApp?.transport?.off('disconnect', handler);
            }
          ).pipe(
            tap(() => {
              setApp(undefined);
              setAppType(LedgerAppType.UNKNOWN);
              throw new Error('Ledger device disconnected');
            })
          )
        ),
        retryWhen((errors) => {
          return errors.pipe(delay(2000));
        })
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, initLedgerApp]);

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
  const popDeviceSelection = useCallback(async () => {
    if (app) {
      return true;
    }
    const [usbTransport] = await resolve(TransportWebUSB.request());
    if (usbTransport) {
      return true;
    }

    throw Error('Ledger device selection failed');
  }, [app]);

  const initLedgerTransport = useCallback(async () => {
    if (initialized) {
      return;
    }
    setInialized(true);
    await request({
      method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
      params: [LEDGER_INSTANCE_UUID],
    });
  }, [initialized, request]);

  return (
    <LedgerContext.Provider
      value={{
        popDeviceSelection,
        getPublicKey,
        initLedgerTransport,
        hasLedgerTransport: !!app,
        appType,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedgerContext() {
  return useContext(LedgerContext);
}
