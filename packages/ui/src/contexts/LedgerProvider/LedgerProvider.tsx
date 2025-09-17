import AppAvalanche from '@avalabs/hw-app-avalanche';
import { ExtensionRequest } from '@core/types';
import { isLockStateChangedEvent, resolve } from '@core/common';
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

export enum LedgerAppType {
  AVALANCHE = 'Avalanche',
  BITCOIN = 'Bitcoin',
  ETHEREUM = 'Ethereum',
  SOLANA = 'Solana',
  UNKNOWN = 'UNKNOWN',
}

export const REQUIRED_LEDGER_VERSION = '0.7.3';
export const LEDGER_VERSION_WITH_EIP_712 = '0.8.0';

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
  getPublicKey(
    accountIndex: number,
    pathType: DerivationPath,
    vm?: VM | 'SVM',
  ): Promise<Buffer>;
  avaxAppVersion: string | null;
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
}>({} as any);

export function LedgerContextProvider({ children }: PropsWithChildren) {
  const [initialized, setInialized] = useState(false);
  const [wasTransportAttempted, setWasTransportAttempted] = useState(false);
  const [app, setApp] = useState<Btc | AppAvalanche | Eth | AppSolana>();
  const [appType, setAppType] = useState<LedgerAppType>(LedgerAppType.UNKNOWN);
  const { request, events } = useConnectionContext();
  const transportRef = useRef<Transport | null>(null);
  const [avaxAppVersion, setAvaxAppVersion] = useState<string | null>(null);
  const [masterFingerprint, setMasterFingerprint] = useState<
    string | undefined
  >();
  const [ledgerVersionWarningClosed, setLedgerVersionWarningClosed] =
    useState<boolean>();

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
            setApp(avaxAppInstance);
            setAppType(LedgerAppType.AVALANCHE);
            return avaxAppInstance;
          } else if (config.appName === LedgerAppType.ETHEREUM) {
            const ethAppInstance = new Eth(transport);
            setApp(ethAppInstance);
            setAppType(LedgerAppType.ETHEREUM);
            return ethAppInstance;
          }
        }
      }

      // check if btc app is selected
      const btcAppInstance = new Btc(transport);

      if (btcAppInstance) {
        const appInfo = await getLedgerAppInfo(transport);

        if (
          LedgerAppType.BITCOIN === (appInfo.applicationName as LedgerAppType)
        ) {
          setApp(btcAppInstance);
          setAppType(LedgerAppType.BITCOIN);
          return btcAppInstance;
        }
      }

      const solanaAppInstance = new AppSolana(transport);
      if (solanaAppInstance) {
        const appInfo = await getLedgerAppInfo(transport);

        if (
          LedgerAppType.SOLANA === (appInfo.applicationName as LedgerAppType)
        ) {
          setApp(solanaAppInstance);
          setAppType(LedgerAppType.SOLANA);
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
            params: [],
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
            Boolean(app) && Boolean(transportRef.current?.deviceModel?.id),
        ),
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

  useEffect(() => {
    console.log({ hasLedgerTransport: !!app });
  }, [app]);

  // Ledger Stax getting locked when connected via USB needs to be detected and the transport needs to be cleared
  // Heartbeat mechanism is being used to detect device lock
  useEffect(() => {
    // Keep monitoring even if app is cleared, but only if transport exists
    if (!transportRef.current) {
      return;
    }

    let isCheckingHeartbeat = false;

    const performHeartbeat = async () => {
      if (isCheckingHeartbeat || !transportRef.current) {
        return;
      }

      isCheckingHeartbeat = true;

      try {
        if (!app) {
          // No app instance - try to re-establish connection
          console.log('Attempting to re-establish Ledger connection...');
          const newApp = await initLedgerApp(transportRef.current);
          if (newApp) {
            console.log('Ledger connection re-established');
            console.log({ hasLedgerTransport: true });
          }
        } else {
          // Send a low-level transport command that should fail when device is locked
          // Use a direct APDU command rather than high-level app methods
          console.log(
            'Testing device responsiveness with direct transport command...',
          );

          // Send a simple GET_VERSION command which should always require device interaction
          await transportRef.current.send(
            0xe0, // CLA - Generic command class
            0x01, // INS - Get version instruction
            0x00, // P1
            0x00, // P2
            Buffer.alloc(0), // Data
            [0x9000], // Expected status code for success
          );

          console.log(
            'Ledger heartbeat: device responsive (direct transport test passed)',
          );
        }
      } catch (error: any) {
        console.log('Ledger heartbeat failed - device may be locked:', {
          error: error.message,
          statusCode: error.statusCode,
          name: error.name,
        });

        // Check if this looks like a device lock error
        const isLockError =
          error?.statusCode === 0x6985 || // Conditions not satisfied
          error?.statusCode === 0x6e00 || // CLA not supported
          error?.statusCode === 0x6d00 || // INS not supported
          error?.statusCode === 0x5515 || // Device locked
          error?.statusCode === 0x6700 || // Wrong length
          error?.statusCode === 0x6f00 || // Technical problem
          error?.statusCode === 0x6faa || // Halted execution
          error?.message?.includes('UNKNOWN_ERROR') ||
          error?.message?.includes('Device locked') ||
          error?.message?.includes('PIN') ||
          error?.message?.includes('timeout') ||
          error?.message?.includes('TIMEOUT') ||
          error?.message?.includes('Invalid status') ||
          error?.name === 'TransportStatusError' ||
          error?.name === 'TimeoutError' ||
          // Catch any communication errors that might indicate lock
          (error?.statusCode && error?.statusCode !== 0x9000);

        if (isLockError && app) {
          // Device appears to be locked, clearing transport but keeping heartbeat running
          console.log(
            'Device appears to be locked, clearing app but continuing to monitor',
          );
          setApp(undefined);
          setAppType(LedgerAppType.UNKNOWN);
          console.log({ hasLedgerTransport: false });
        }
      } finally {
        isCheckingHeartbeat = false;
      }
    };

    // Start heartbeat every 5 seconds
    const heartbeatInterval = setInterval(performHeartbeat, 5000);

    // Perform initial heartbeat after a short delay
    setTimeout(performHeartbeat, 2000);

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [app, initLedgerApp]);

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
        avaxAppVersion,
        masterFingerprint,
        setMasterFingerprint,
        getMasterFingerprint,
        getBtcExtendedPublicKey,
        registerBtcWalletPolicy,
        updateLedgerVersionWarningClosed,
        ledgerVersionWarningClosed,
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
