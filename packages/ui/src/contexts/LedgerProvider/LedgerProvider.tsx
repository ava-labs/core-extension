import AppAvalanche from '@avalabs/hw-app-avalanche';
import { ExtensionRequest } from '@core/types';
import { isLockStateChangedEvent, resolve, withTimeout } from '@core/common';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import {
  AppClient as Btc,
  DefaultWalletPolicy,
  WalletPolicy,
} from 'ledger-bitcoin';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  delay,
  filter,
  fromEventPattern,
  map,
  of,
  retryWhen,
  switchMap,
  tap,
} from 'rxjs';
import AppSolana from '@ledgerhq/hw-app-solana';

import { VM } from '@avalabs/avalanchejs';
import {
  DerivationPath,
  getLedgerAppInfo,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
  quitLedgerApp,
  getSolanaPublicKeyFromLedger,
} from '@avalabs/core-wallets-sdk';
import {
  CloseLedgerTransportHandler,
  GetLedgerVersionWarningHandler,
  InitLedgerTransportHandler,
  LedgerResponseHandler,
  LedgerVersionWarningClosedHandler,
  RemoveLedgerTransportHandler,
} from '@core/service-worker';
import { LedgerEvent } from '@core/types';
import Eth from '@ledgerhq/hw-app-eth';
import Transport from '@ledgerhq/hw-transport';
import {
  isLedgerDeviceRequestEvent,
  ledgerDiscoverTransportsEventListener,
} from './listeners';
import { useConnectionContext } from '../ConnectionProvider';
import { getLedgerTransport } from '../utils/getLedgerTransport';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { shouldUseWebHID } from '../utils/shouldUseWebHID';

export enum LedgerAppType {
  AVALANCHE = 'Avalanche',
  BITCOIN = 'Bitcoin', // Works up to 2.4.2 version. 2.4.3 prevents from using non-standard derivation paths.
  BITCOIN_RECOVERY = 'Bitcoin Recovery', // Can be used by people who updated the Bitcoin app to 2.4.3+.
  ETHEREUM = 'Ethereum',
  SOLANA = 'Solana',
  UNKNOWN = 'UNKNOWN',
}

export const REQUIRED_LEDGER_VERSION = '0.7.3';
export const LEDGER_VERSION_WITH_EIP_712 = '0.8.0';
export const MAX_BITCOIN_APP_VERSION = '2.4.2';

/**
 * Run this here since each new window will have a different id
 * this is used to track the transport and close on window close
 */
const LEDGER_INSTANCE_UUID = crypto.randomUUID();

type AppConfig = {
  isBlindSigningEnabled: boolean;
};

const LedgerContext = createContext<{
  popDeviceSelection(): Promise<boolean>;
  getExtendedPublicKey(path?: string): Promise<string>;
  initLedgerTransport(): Promise<void>;
  hasLedgerTransport: boolean;
  appType: LedgerAppType;
  wasTransportAttempted: boolean;
  getPublicKey(
    accountIndex: number,
    pathType: DerivationPath,
    vm?: VM | 'SVM',
  ): Promise<Buffer>;
  avaxAppVersion: string | null;
  appVersion: string | null;
  masterFingerprint: string | undefined;
  setMasterFingerprint: (masterFingerprint?: string) => void;
  getMasterFingerprint(): Promise<string>;
  getBtcExtendedPublicKey(path: string): Promise<string>;
  registerBtcWalletPolicy(
    xpub: string,
    masterFingerprint: string,
    derivationpath: string,
    name: string,
  ): Promise<readonly [Buffer, Buffer]>;
  updateLedgerVersionWarningClosed(): Promise<void>;
  ledgerVersionWarningClosed: boolean | undefined;
  closeCurrentApp: () => Promise<void>;
  refreshActiveApp: () => Promise<void>;
  appConfig: null | { isBlindSigningEnabled: boolean };
}>({} as any);

export function LedgerContextProvider({ children }: PropsWithChildren) {
  const [initialized, setInialized] = useState(false);
  const [wasTransportAttempted, setWasTransportAttempted] = useState(false);
  const [app, setApp] = useState<Btc | AppAvalanche | Eth | AppSolana>();
  const [appType, setAppType] = useState<LedgerAppType>(LedgerAppType.UNKNOWN);
  const { request, events } = useConnectionContext();
  const transportRef = useRef<Transport | null>(null);
  const [
    /**
     * @deprecated Use `appVersion` instead
     */
    avaxAppVersion,
    /**
     * @deprecated Use `setAppVersion` instead
     */
    setAvaxAppVersion,
  ] = useState<string | null>(null);
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const [masterFingerprint, setMasterFingerprint] = useState<
    string | undefined
  >();
  const [ledgerVersionWarningClosed, setLedgerVersionWarningClosed] =
    useState<boolean>();
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);

  /**
   * Listen for send events to a ledger instance
   */
  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(isLedgerDeviceRequestEvent),
        filter((evt) => evt.value.connectionUUID === LEDGER_INSTANCE_UUID),
      )
      .subscribe(async (res) => {
        if (res.value.method === 'SEND') {
          try {
            // If data is being exchanged right now, wait for it to complete.
            if (transportRef.current?.exchangeBusyPromise) {
              await withTimeout(
                transportRef.current.exchangeBusyPromise,
                1_500, // Usually the conflicting exchange will be us querying for the device status, which is pretty fast.
              );
            }

            const { cla, ins, p1, p2, data, statusList } = res.value.params;
            const result = await transportRef.current?.send(
              cla,
              ins,
              p1,
              p2,
              Buffer.from(data),
              statusList,
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
                  error: e?.['statusCode']
                    ? e['statusCode']
                    : (e as Error).message,
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
    const handler = () => {
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
    async (
      transport?: Transport | null,
    ): Promise<Btc | AppAvalanche | Eth | AppSolana> => {
      if (!transport) {
        throw new Error('Ledger not connected');
      }

      // If data is being exchanged right now, wait for it to complete.
      if (transportRef.current?.exchangeBusyPromise) {
        await withTimeout(
          transportRef.current.exchangeBusyPromise,
          15_000, // Usually the conflicting exchange here will be a signing request, which may take a while.
        );
      }

      // first try to get the avalanche App instance
      const avaxAppInstance = new AppAvalanche(transport);
      if (avaxAppInstance) {
        // double check it's really the avalanche app
        // other apps also initialize with AppAvax
        const [config, appVersionError] = await resolve(
          avaxAppInstance.getAppInfo(),
        );

        if (!appVersionError) {
          if (config.appName === LedgerAppType.AVALANCHE) {
            setAvaxAppVersion(config.appVersion);
            setAppVersion(config.appVersion);
            setApp(avaxAppInstance);
            setAppType(LedgerAppType.AVALANCHE);
            setAppConfig(null);
            return avaxAppInstance;
          } else if (config.appName === LedgerAppType.ETHEREUM) {
            const ethAppInstance = new Eth(transport);
            setAppVersion(config.appVersion);
            setApp(ethAppInstance);
            setAppType(LedgerAppType.ETHEREUM);
            const ethConfig = await ethAppInstance.getAppConfiguration();
            setAppConfig({
              isBlindSigningEnabled: !!ethConfig.arbitraryDataEnabled,
            });
            return ethAppInstance;
          }
        }
      }

      // check if btc app is selected
      const btcAppInstance = new Btc(transport);

      if (btcAppInstance) {
        const appInfo = await getLedgerAppInfo(transport);

        if (LedgerAppType.BITCOIN === appInfo.applicationName) {
          setAppVersion(appInfo.version);
          setApp(btcAppInstance);
          setAppType(LedgerAppType.BITCOIN);
          setAppConfig(null);
          return btcAppInstance;
        } else if (LedgerAppType.BITCOIN_RECOVERY === appInfo.applicationName) {
          setAppVersion(appInfo.version);
          setApp(btcAppInstance);
          setAppType(LedgerAppType.BITCOIN_RECOVERY);
          return btcAppInstance;
        }
      }

      const solanaAppInstance = new AppSolana(transport);
      if (solanaAppInstance) {
        const appInfo = await getLedgerAppInfo(transport);

        if (LedgerAppType.SOLANA === appInfo.applicationName) {
          setAppVersion(appInfo.version);
          setApp(solanaAppInstance);
          setAppType(LedgerAppType.SOLANA);
          setAppConfig(null);
          return solanaAppInstance;
        }
      }

      throw new Error('No compatible ledger app found');
    },
    [],
  );

  useEffect(() => {
    const subscription = of([initialized])
      .pipe(
        filter(([isInitialized]) => !!isInitialized),
        switchMap(() =>
          request<CloseLedgerTransportHandler>({
            method: ExtensionRequest.LEDGER_CLOSE_TRANSPORT,
            params: {
              currentTransportUUID: LEDGER_INSTANCE_UUID,
            },
          }),
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
            },
          ).pipe(
            tap(() => {
              setApp(undefined);
              setAppType(LedgerAppType.UNKNOWN);
              setAppConfig(null);
              throw new Error('Ledger device disconnected');
            }),
          ),
        ),
        retryWhen((errors) => {
          setWasTransportAttempted(true);
          return errors.pipe(delay(2000));
        }),
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, initLedgerApp, request]);

  const refreshActiveApp = useCallback(async () => {
    if (!transportRef.current) {
      return;
    }

    initLedgerApp(transportRef.current);
  }, [initLedgerApp]);

  /**
   * Get the extended public key for the given path (m/44'/60'/0' by default)
   * @returns Promise<extended public key>
   */
  const getExtendedPublicKey = useCallback(async (path?: string) => {
    if (!transportRef.current) {
      throw new Error('no device detected');
    }
    const [pubKey, pubKeyError] = await resolve(
      getLedgerExtendedPublicKey(transportRef.current, false, path),
    );
    if (pubKeyError) {
      throw new Error(pubKeyError);
    }
    return pubKey;
  }, []);

  const getPublicKey = useCallback(
    async (accountIndex: number, pathType: DerivationPath, vm: VM | 'SVM') => {
      if (!transportRef.current) {
        throw new Error('no device detected');
      }

      if (vm === 'SVM') {
        return getSolanaPublicKeyFromLedger(accountIndex, transportRef.current);
      }

      return getPubKeyFromTransport(
        transportRef.current,
        accountIndex,
        pathType,
        vm,
      );
    },
    [],
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

    const useWebHID = await shouldUseWebHID();

    const [deviceTransport] = await resolve<Transport>(
      useWebHID ? TransportWebHID.request() : TransportWebUSB.request(),
    );

    if (deviceTransport) {
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
      setAppType(LedgerAppType.UNKNOWN);
      setApp(undefined);
      setAppConfig(null);
    }
  }, [transportRef]);

  useEffect(() => {
    const subscription = events()
      .pipe(
        filter((evt) => evt.name === LedgerEvent.TRANSPORT_CLOSE_REQUEST),
        filter((evt) => {
          // Only the window that most recently requested a USB transport will remain open.
          // This is to avoid the issue where a window is opened, the transport is claimed, and then another window is opened.
          // The second window will then be unable to claim the transport because it is already claimed by the first window.
          // This is a workaround to avoid the issue.
          return evt.value.currentTransportUUID !== LEDGER_INSTANCE_UUID;
        }),
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

    const subscription = events()
      .pipe(
        filter(isLockStateChangedEvent),
        map((evt) => evt.value),
      )
      .subscribe((locked) => {
        if (locked) {
          // No need to requery ExtensionRequest.SHOW_LEDGER_VERSION_WARNING
          // because it will always be false when locked because the session
          // storage is emptied on lock.
          setLedgerVersionWarningClosed(false);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  const getMasterFingerprint = useCallback(async () => {
    if (!(app instanceof Btc)) {
      throw new Error('wrong app');
    }

    return app.getMasterFingerprint();
  }, [app]);

  const getBtcExtendedPublicKey = useCallback(
    async (path: string) => {
      if (!(app instanceof Btc)) {
        throw new Error('wrong app');
      }

      return app.getExtendedPubkey(path, true);
    },
    [app],
  );

  const registerBtcWalletPolicy = useCallback(
    async (
      xpub: string,
      fingerprint: string,
      derivationpath: string,
      name: string,
    ) => {
      if (!(app instanceof Btc)) {
        throw new Error('wrong app');
      }

      const template = new DefaultWalletPolicy(
        `wpkh(@0/**)`,
        `[${fingerprint}/${derivationpath}]${xpub}`,
      );

      const walletPolicy = new WalletPolicy(name, `wpkh(@0/**)`, template.keys);

      return app.registerWallet(walletPolicy);
    },
    [app],
  );

  const updateLedgerVersionWarningClosed = useCallback(async () => {
    const result = await request<LedgerVersionWarningClosedHandler>({
      method: ExtensionRequest.LEDGER_VERSION_WARNING_CLOSED,
    });
    setLedgerVersionWarningClosed(result);
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
        appConfig,
        getPublicKey,
        appVersion,
        avaxAppVersion,
        masterFingerprint,
        setMasterFingerprint,
        getMasterFingerprint,
        getBtcExtendedPublicKey,
        registerBtcWalletPolicy,
        updateLedgerVersionWarningClosed,
        ledgerVersionWarningClosed,
        closeCurrentApp,
        refreshActiveApp,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedgerContext() {
  return useContext(LedgerContext);
}
