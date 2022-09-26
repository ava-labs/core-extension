import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
import { LedgerResponseHandler } from '@src/background/services/ledger/handlers/ledgerResponse';
import { InitLedgerTransportHandler } from '@src/background/services/ledger/handlers/initLedgerTransport';
import { RemoveLedgerTransportHandler } from '@src/background/services/ledger/handlers/removeLedgerTransport';
import {
  DerivationPath,
  getLedgerExtendedPublicKeyOfAccount,
  getPubKeyFromTransport,
} from '@avalabs/wallets-sdk';
import { CloseLedgerTransportHandler } from '@src/background/services/ledger/handlers/closeOpenTransporters';

export enum LedgerAppType {
  AVALANCHE = 'Avalanche',
  BITCOIN = 'Bitcoin',
  ETHEREUM = 'Ethereum',
  UNKNOWN = 'UNKNOWN',
}
export const SUPPORTED_LEDGER_VERSION = '0.5.9';
/**
 * Run this here since each new window will have a different id
 * this is used to track the transport and close on window close
 */
const LEDGER_INSTANCE_UUID = crypto.randomUUID();

const LedgerContext = createContext<{
  popDeviceSelection(): Promise<boolean>;
  getExtendedPublicKey(): Promise<string>;
  initLedgerTransport(): Promise<void>;
  hasLedgerTransport: boolean;
  appType: LedgerAppType;
  wasTransportAttempted: boolean;
  getPublicKey(accountIndex: number, pathType: DerivationPath): Promise<Buffer>;
  closeTransport: () => void;
}>({} as any);

export function LedgerContextProvider({ children }: { children: any }) {
  const [initialized, setInialized] = useState(false);
  const [wasTransportAttempted, setWasTransportAttempted] = useState(false);
  const [app, setApp] = useState<Btc | AppAvax | Eth>();
  const [appType, setAppType] = useState<LedgerAppType>(LedgerAppType.UNKNOWN);
  const { request, events } = useConnectionContext();
  const transportRef = useRef<Transport | null>(null);

  /**
   * Listen for send events to a ledger instance
   */
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
            request<LedgerResponseHandler>({
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
            request<LedgerResponseHandler>({
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

  /**
   * Create instance for a given UUID
   */
  useEffect(() => {
    const subscription = events()
      .pipe(filter(ledgerDiscoverTransportsEventListener))
      .subscribe(() => {
        if (initialized) {
          request<InitLedgerTransportHandler>({
            method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
            params: [LEDGER_INSTANCE_UUID],
          });
        }
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [events, initialized, request]);

  /**
   * Remove an instance by UUID when a window is about to unload
   */
  useEffect(() => {
    const handler = (ev) => {
      ev.preventDefault();
      request<RemoveLedgerTransportHandler>({
        method: ExtensionRequest.LEDGER_REMOVE_TRANSPORT,
        params: [LEDGER_INSTANCE_UUID],
      });
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
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
        switchMap(() =>
          request<CloseLedgerTransportHandler>({
            method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
            params: [],
          })
        ),
        switchMap(() => getLedgerTransport()),
        switchMap((transport) => {
          transportRef.current = transport;
          return initLedgerApp(transport);
        }),
        tap(() => {
          setWasTransportAttempted(true);
        }),
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
          setWasTransportAttempted(true);
          return errors.pipe(delay(2000));
        })
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, initLedgerApp, request]);

  const closeTransport = () => {
    if (app && initialized) {
      setInialized(false);
      app.transport.close();
      setApp(undefined);
    }
  };

  /**
   *
   * @returns Promise<public key>
   */
  async function getExtendedPublicKey() {
    if (!transportRef.current) {
      throw new Error('no device detected');
    }
    const [pubKey, pubKeyError] = await resolve(
      getLedgerExtendedPublicKeyOfAccount(transportRef.current)
    );
    if (pubKeyError) {
      throw new Error(pubKeyError);
    }
    return pubKey;
  }

  async function getPublicKey(accountIndex: number, pathType: DerivationPath) {
    if (!transportRef.current) {
      throw new Error('no device detected');
    }
    return getPubKeyFromTransport(transportRef.current, accountIndex, pathType);
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
    await request<InitLedgerTransportHandler>({
      method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
      params: [LEDGER_INSTANCE_UUID],
    });
  }, [initialized, request]);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter((evt) => evt.name === LedgerEvent.TRANSPORT_CLOSE_REQUEST),
        filter(() =>
          // check if there if the window is claiming interface index 2. We should close the window
          // which would clean up the claimed interfaces, thereby releasing it to the new window

          // In windows where this interface wasnt claimed the values here will be false
          app?.transport?.device.configuration.interfaces.some(
            (i) => i.claimed && i.interfaceNumber === 2
          )
        )
      )
      .subscribe(() => {
        window.close();
      });
    return () => {
      subscription.unsubscribe();
    };
  });

  return (
    <LedgerContext.Provider
      value={{
        popDeviceSelection,
        getExtendedPublicKey,
        initLedgerTransport,
        hasLedgerTransport: !!app,
        wasTransportAttempted,
        appType,
        getPublicKey,
        closeTransport,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedgerContext() {
  return useContext(LedgerContext);
}
