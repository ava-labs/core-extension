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
  map,
} from 'rxjs';
import { getLedgerTransport } from '@src/contexts/utils/getLedgerTransport';
import AppAvalanche from '@avalabs/hw-app-avalanche';

import Btc from '@ledgerhq/hw-app-btc';
import Transport from '@ledgerhq/hw-transport';
import { ledgerDiscoverTransportsEventListener } from '@src/background/services/ledger/events/ledgerDiscoverTransportsEventListener';
import { LedgerEvent } from '@src/background/services/ledger/models';
import { LedgerResponseHandler } from '@src/background/services/ledger/handlers/ledgerResponse';
import { InitLedgerTransportHandler } from '@src/background/services/ledger/handlers/initLedgerTransport';
import { RemoveLedgerTransportHandler } from '@src/background/services/ledger/handlers/removeLedgerTransport';
import {
  DerivationPath,
  getAddressDerivationPath,
  getLedgerAppInfo,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
  quitLedgerApp,
} from '@avalabs/wallets-sdk';
import { CloseLedgerTransportHandler } from '@src/background/services/ledger/handlers/closeOpenTransporters';
import { GetLedgerVersionWarningHandler } from '@src/background/services/ledger/handlers/getLedgerVersionWarning';
import { LedgerVersionWarningClosedHandler } from '@src/background/services/ledger/handlers/setLedgerVersionWarningClosed';
import { lockStateChangedEventListener } from '@src/background/services/lock/events/lockStateChangedEventListener';
import { VM } from '@avalabs/avalanchejs-v2';
import isLedgerBtcAppCorrect from '@src/utils/isLedgerBtcAppCorrect';
import { LedgerIncorrectBtcAppWarningClosedHandler } from '@src/background/services/ledger/handlers/setLedgerIncorrectBtcAppWarningClosed';
import { GetLedgerIncorrectBtcAppWarningHandler } from '@src/background/services/ledger/handlers/getLedgerIncorrectBtcAppWarning';

export enum LedgerAppType {
  AVALANCHE = 'Avalanche',
  BITCOIN = 'Bitcoin',
  BITCOIN_LEGACY = 'Bitcoin Legacy',
  UNKNOWN = 'UNKNOWN',
}

export const REQUIRED_LEDGER_VERSION = '0.6.0';

/**
 * Run this here since each new window will have a different id
 * this is used to track the transport and close on window close
 */
const LEDGER_INSTANCE_UUID = crypto.randomUUID();

const LedgerContext = createContext<{
  popDeviceSelection(): Promise<boolean>;
  getExtendedPublicKey(path?: string): Promise<string>;
  initLedgerTransport(): Promise<void>;
  hasLedgerTransport: boolean;
  appType: LedgerAppType;
  wasTransportAttempted: boolean;
  getBtcPublicKey(
    accountIndex: number,
    pathType: DerivationPath
  ): Promise<Buffer>;
  getPublicKey(
    accountIndex: number,
    pathType: DerivationPath,
    vm?: VM
  ): Promise<Buffer>;
  avaxAppVersion: string | null;
  isCorrectBtcApp: boolean;
  updateLedgerVersionWarningClosed(): Promise<void>;
  ledgerVersionWarningClosed: boolean | undefined;
  updateLedgerIncorrectBtcAppWarningClosed(): Promise<void>;
  ledgerIncorrectBtcAppWarningClosed: boolean | undefined;
  closeCurrentApp: () => Promise<void>;
}>({} as any);

export function LedgerContextProvider({ children }: { children: any }) {
  const [initialized, setInialized] = useState(false);
  const [wasTransportAttempted, setWasTransportAttempted] = useState(false);
  const [app, setApp] = useState<Btc | AppAvalanche>();
  const [appType, setAppType] = useState<LedgerAppType>(LedgerAppType.UNKNOWN);
  const { request, events } = useConnectionContext();
  const transportRef = useRef<Transport | null>(null);
  const [avaxAppVersion, setAvaxAppVersion] = useState<string | null>(null);
  const [isCorrectBtcApp, setIsCorrectBtcApp] = useState<boolean>(true);
  const [ledgerVersionWarningClosed, setLedgerVersionWarningClosed] =
    useState<boolean>();
  const [
    ledgerIncorrectBtcAppWarningClosed,
    setLedgerIncorrectBtcAppWarningClosed,
  ] = useState<boolean>();

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
            const result = await transportRef.current?.send(
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
  }, [request, events, transportRef]);

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
    async (transport?: Transport | null): Promise<Btc | AppAvalanche> => {
      if (!transport) {
        throw new Error('Ledger not connected');
      }

      // first try to get the avalanche App instance
      const avaxAppInstance = new AppAvalanche(transport);
      if (avaxAppInstance) {
        // double check it's really the avalanche app
        // other apps also initialize with AppAvax
        const [config, appVersionError] = await resolve(
          avaxAppInstance.getAppInfo()
        );

        if (!appVersionError && config.appName === LedgerAppType.AVALANCHE) {
          setAvaxAppVersion(config.appVersion);
          setApp(avaxAppInstance);
          setAppType(LedgerAppType.AVALANCHE);
          return avaxAppInstance;
        }
      }

      // check if btc app is selected
      const btcAppInstance = new Btc({ transport });

      if (btcAppInstance) {
        const appInfo = await getLedgerAppInfo(transport);

        if (
          [LedgerAppType.BITCOIN, LedgerAppType.BITCOIN_LEGACY].includes(
            appInfo.applicationName as LedgerAppType
          )
        ) {
          setApp(btcAppInstance);
          setAppType(LedgerAppType.BITCOIN);

          // We support Ledger Bitcoin applications with version < 2.1.0
          // If the version is >= 2.1.0 we want to prompt the user to switch to the Bitcoin Legacy app
          // (until we find a way to support newer versions)
          const isCorrectBtcApp = isLedgerBtcAppCorrect(appInfo);
          setIsCorrectBtcApp(isCorrectBtcApp);
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
        switchMap(() =>
          fromEventPattern(
            (handler) => {
              transportRef.current?.on('disconnect', handler);
            },
            (handler) => {
              transportRef.current?.off('disconnect', handler);
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

  /**
   * Get the extended public key for the given path (m/44'/60'/0' by default)
   * @returns Promise<extended public key>
   */
  async function getExtendedPublicKey(path?: string) {
    if (!transportRef.current) {
      throw new Error('no device detected');
    }
    const [pubKey, pubKeyError] = await resolve(
      getLedgerExtendedPublicKey(transportRef.current, false, path)
    );
    if (pubKeyError) {
      throw new Error(pubKeyError);
    }
    return pubKey;
  }

  async function getPublicKey(
    accountIndex: number,
    pathType: DerivationPath,
    vm: VM = 'EVM'
  ) {
    if (!transportRef.current) {
      throw new Error('no device detected');
    }
    return getPubKeyFromTransport(
      transportRef.current,
      accountIndex,
      pathType,
      vm
    );
  }

  const getBtcPublicKey = useCallback(
    async (accountIndex: number, pathType: DerivationPath) => {
      if (!app || appType !== LedgerAppType.BITCOIN) {
        throw new Error('no device detected');
      }

      const derivationPath = getAddressDerivationPath(
        accountIndex,
        pathType,
        'EVM'
      );

      const { publicKey } = await (app as Btc).getWalletPublicKey(
        derivationPath
      );

      return Buffer.from(publicKey, 'hex');
    },
    [app, appType]
  );

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
    await request<InitLedgerTransportHandler>({
      method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
      params: [LEDGER_INSTANCE_UUID],
    });
    setInialized(true);
  }, [initialized, request]);

  const closeCurrentApp = useCallback(async () => {
    if (transportRef.current) {
      // send get app version first as a workaround for BTC bug: https://github.com/LedgerHQ/app-bitcoin-new/issues/63
      await getLedgerAppInfo(transportRef.current);
      // quit the app: https://developers.ledger.com/docs/transport/open-close-info-on-apps/#quit-application
      await quitLedgerApp(transportRef.current);
    }
  }, [transportRef]);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter((evt) => evt.name === LedgerEvent.TRANSPORT_CLOSE_REQUEST),
        filter(
          () =>
            // check if there if the window is claiming interface index 2. We should close the window
            // which would clean up the claimed interfaces, thereby releasing it to the new window

            // In windows where this interface wasnt claimed the values here will be false
            Boolean(app) && Boolean(transportRef.current?.deviceModel?.id)
        )
      )
      .subscribe(() => {
        window.close();
      });
    return () => {
      subscription.unsubscribe();
    };
  });

  useEffect(() => {
    request<GetLedgerVersionWarningHandler>({
      method: ExtensionRequest.SHOW_LEDGER_VERSION_WARNING,
    }).then((result) => {
      setLedgerVersionWarningClosed(result);
    });

    request<GetLedgerIncorrectBtcAppWarningHandler>({
      method: ExtensionRequest.SHOW_LEDGER_INCORRECT_BTC_APP_WARNING,
    }).then((result) => {
      setLedgerIncorrectBtcAppWarningClosed(result);
    });

    const subscription = events()
      .pipe(
        filter(lockStateChangedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((locked) => {
        if (locked) {
          // No need to requery ExtensionRequest.SHOW_LEDGER_VERSION_WARNING
          // because it will always be false when locked because the session
          // storage is emptied on lock.
          setLedgerVersionWarningClosed(false);
          setLedgerIncorrectBtcAppWarningClosed(false);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  const updateLedgerVersionWarningClosed = useCallback(async () => {
    const result = await request<LedgerVersionWarningClosedHandler>({
      method: ExtensionRequest.LEDGER_VERSION_WARNING_CLOSED,
    });
    setLedgerVersionWarningClosed(result);
  }, [request]);

  const updateLedgerIncorrectBtcAppWarningClosed = useCallback(async () => {
    const result = await request<LedgerIncorrectBtcAppWarningClosedHandler>({
      method: ExtensionRequest.LEDGER_INCORRECT_BTC_APP_WARNING_CLOSED,
    });
    setLedgerIncorrectBtcAppWarningClosed(result);
  }, [request]);

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
        getBtcPublicKey,
        avaxAppVersion,
        isCorrectBtcApp,
        updateLedgerVersionWarningClosed,
        ledgerVersionWarningClosed,
        ledgerIncorrectBtcAppWarningClosed,
        updateLedgerIncorrectBtcAppWarningClosed,
        closeCurrentApp,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedgerContext() {
  return useContext(LedgerContext);
}
