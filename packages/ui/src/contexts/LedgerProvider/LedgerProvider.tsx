import { ExtensionRequest } from '@core/types';
import {
  getEvmExtendedKeyPath,
  isLockStateChangedEvent,
  resolve,
} from '@core/common';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { filter, map } from 'rxjs';

import { VM } from '@avalabs/avalanchejs';
import {
  DerivationPath,
  ETH_ACCOUNT_PATH,
  getAddressPublicKeyFromXPub,
} from '@avalabs/core-wallets-sdk';
import {
  GetLedgerVersionWarningHandler,
  LedgerDeviceRequestHandler,
  LedgerDeviceRequestParams,
  LedgerVersionWarningClosedHandler,
} from '@core/service-worker';
import { useConnectionContext } from '../ConnectionProvider';

export enum LedgerAppType {
  AVALANCHE = 'Avalanche',
  BITCOIN = 'Bitcoin', // Works up to 2.4.2 version. 2.4.3 prevents from using non-standard derivation paths.
  BITCOIN_RECOVERY = 'Bitcoin Recovery', // Can be used by people who updated the Bitcoin app to 2.4.3+.
  ETHEREUM = 'Ethereum',
  SOLANA = 'Solana',
  UNKNOWN = 'UNKNOWN',
  DASHBOARD = 'BOLOS', // Device is unlocked but sitting on the dashboard with no app open.
}

export const REQUIRED_LEDGER_VERSION = '0.7.3';
export const LEDGER_VERSION_WITH_EIP_712 = '0.8.0';
export const MAX_BITCOIN_APP_VERSION = '2.4.2';

/** USB vendor id shared by all Ledger devices, used for the WebHID grant prompt. */
const LEDGER_USB_VENDOR_ID = 0x2c97;

type AppConfig = {
  isBlindSigningEnabled: boolean;
};

const toLedgerAppType = (applicationName: string): LedgerAppType => {
  switch (applicationName) {
    case LedgerAppType.AVALANCHE:
    case LedgerAppType.BITCOIN:
    case LedgerAppType.BITCOIN_RECOVERY:
    case LedgerAppType.ETHEREUM:
    case LedgerAppType.SOLANA:
    case LedgerAppType.DASHBOARD:
      return applicationName as LedgerAppType;
    default:
      return LedgerAppType.UNKNOWN;
  }
};

const LedgerContext = createContext<{
  popDeviceSelection(): Promise<boolean>;
  getExtendedPublicKey(path?: string): Promise<string>;
  /**
   * BOLOS quit/open-app to the given app (if needed) and refresh `appType` / `appVersion` from the device.
   */
  prepareTransportForOnboarding(appName: LedgerAppType): Promise<void>;
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
  /**
   * Do not use it directly unless necessary. Use `useActiveLedgerAppInfo()` hook instead.
   */
  registerSubscriber: () => void;
  /**
   * Do not use it directly unless necessary. Use `useActiveLedgerAppInfo()` hook instead.
   */
  unregisterSubscriber: () => void;
  appConfig: null | { isBlindSigningEnabled: boolean };
}>({} as any);

export function LedgerContextProvider({ children }: PropsWithChildren) {
  const { request, events } = useConnectionContext();
  const [wasTransportAttempted, setWasTransportAttempted] = useState(false);
  const [hasDevice, setHasDevice] = useState(false);
  const [appType, setAppType] = useState<LedgerAppType>(LedgerAppType.UNKNOWN);
  const [avaxAppVersion, setAvaxAppVersion] = useState<string | null>(null);
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const [masterFingerprint, setMasterFingerprint] = useState<
    string | undefined
  >();
  const [ledgerVersionWarningClosed, setLedgerVersionWarningClosed] =
    useState<boolean>();
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);

  /**
   * All device I/O runs on the service worker (the sole owner of the WebHID
   * connection). The frontend only issues these RPCs and performs the
   * `requestDevice()` permission grant.
   */
  const deviceRequest = useCallback(
    (params: LedgerDeviceRequestParams) =>
      request<LedgerDeviceRequestHandler>({
        method: ExtensionRequest.LEDGER_DEVICE_REQUEST,
        params: [params],
      }),
    [request],
  );

  const refreshActiveApp = useCallback(async () => {
    setWasTransportAttempted(true);

    const [info, error] = await resolve(deviceRequest({ op: 'getAppInfo' }));

    if (error || !info || !('applicationName' in info)) {
      setHasDevice(false);
      setAppType(LedgerAppType.UNKNOWN);
      setAppVersion(null);
      setAvaxAppVersion(null);
      setAppConfig(null);
      return;
    }

    const { applicationName, version } = info;
    const type = toLedgerAppType(applicationName);

    setHasDevice(true);
    setAppType(type);
    setAppVersion(version);
    setAvaxAppVersion(type === LedgerAppType.AVALANCHE ? version : null);

    if (type === LedgerAppType.ETHEREUM) {
      const [config] = await resolve(deviceRequest({ op: 'getEthAppConfig' }));
      setAppConfig(config && 'isBlindSigningEnabled' in config ? config : null);
    } else {
      setAppConfig(null);
    }
  }, [deviceRequest]);

  const [subscribers, setSubscribers] = useState(0);
  const registerSubscriber = useCallback(() => {
    setSubscribers((oldSubscribers) => oldSubscribers + 1);
  }, []);

  const unregisterSubscriber = useCallback(() => {
    setSubscribers((oldSubscribers) => Math.max(0, oldSubscribers - 1));
  }, []);

  // Poll the active app every 2 seconds while something needs the device.
  useEffect(() => {
    if (subscribers === 0) {
      return;
    }

    let timeout: NodeJS.Timeout | null = null;
    const scheduleNextCheck = () => {
      timeout = setTimeout(
        () => refreshActiveApp().finally(scheduleNextCheck),
        2_000,
      );
    };

    refreshActiveApp().finally(scheduleNextCheck);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [refreshActiveApp, subscribers]);

  const getExtendedPublicKey = useCallback(
    async (path?: string) => {
      const [result, error] = await resolve(
        deviceRequest({
          op: 'getExtendedPublicKey',
          path: path ?? ETH_ACCOUNT_PATH,
        }),
      );

      if (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }

      if (!result || !('xpub' in result)) {
        throw new Error('Ledger returned no extended public key');
      }

      return result.xpub;
    },
    [deviceRequest],
  );

  const prepareTransportForOnboarding = useCallback(
    async (appName: LedgerAppType) => {
      await deviceRequest({ op: 'ensureAppOpen', appName });
      await refreshActiveApp();
    },
    [deviceRequest, refreshActiveApp],
  );

  const getPublicKey = useCallback(
    async (accountIndex: number, pathType: DerivationPath, vm: VM | 'SVM') => {
      if (vm === 'SVM') {
        const result = await deviceRequest({
          op: 'getSolanaPublicKey',
          accountIndex,
        });
        if (!result || !('publicKeyHex' in result)) {
          throw new Error('Ledger returned no Solana public key');
        }
        return Buffer.from(result.publicKeyHex, 'hex');
      }

      // The C-Chain (EVM) address public key is derived from the account's
      // extended public key — no per-address device call needed.
      const isBip44 = pathType === DerivationPath.BIP44;
      const xpub = await getExtendedPublicKey(
        getEvmExtendedKeyPath(isBip44 ? 0 : accountIndex),
      );
      return getAddressPublicKeyFromXPub(xpub, isBip44 ? accountIndex : 0);
    },
    [deviceRequest, getExtendedPublicKey],
  );

  /**
   * Prompts the WebHID device-permission chooser. Requires a user gesture on a
   * tab view (not the popup/confirm windows). This only grants access — the
   * service worker opens the device via `navigator.hid.getDevices()`.
   */
  const popDeviceSelection = useCallback(async () => {
    if (hasDevice) {
      return true;
    }

    // WebHID isn't in the DOM lib typings; the runtime API is present in the
    // extension's Chromium target.
    const hid = (
      navigator as unknown as {
        hid: {
          requestDevice(options: {
            filters: { vendorId: number }[];
          }): Promise<unknown[]>;
        };
      }
    ).hid;

    const [devices] = await resolve(
      hid.requestDevice({ filters: [{ vendorId: LEDGER_USB_VENDOR_ID }] }),
    );

    if (devices && devices.length > 0) {
      await refreshActiveApp();
      return true;
    }

    throw new Error('Ledger device selection failed');
  }, [hasDevice, refreshActiveApp]);

  const initLedgerTransport = useCallback(async () => {
    await refreshActiveApp();
  }, [refreshActiveApp]);

  const closeCurrentApp = useCallback(async () => {
    await deviceRequest({ op: 'closeApp' });
    setAppType(LedgerAppType.UNKNOWN);
    setAppConfig(null);
  }, [deviceRequest]);

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
    const result = await deviceRequest({ op: 'getBtcMasterFingerprint' });
    if (!result || !('fingerprint' in result)) {
      throw new Error('Ledger returned no master fingerprint');
    }
    return result.fingerprint;
  }, [deviceRequest]);

  const getBtcExtendedPublicKey = useCallback(
    async (path: string) => {
      const result = await deviceRequest({
        op: 'getBtcExtendedPublicKey',
        path,
      });
      if (!result || !('xpub' in result)) {
        throw new Error('Ledger returned no BTC extended public key');
      }
      return result.xpub;
    },
    [deviceRequest],
  );

  const registerBtcWalletPolicy = useCallback(
    async (
      xpub: string,
      fingerprint: string,
      derivationpath: string,
      name: string,
    ): Promise<readonly [Buffer, Buffer]> => {
      const result = await deviceRequest({
        op: 'registerBtcWalletPolicy',
        xpub,
        masterFingerprint: fingerprint,
        derivationPath: derivationpath,
        name,
      });
      if (!result || !('policyIdHex' in result)) {
        throw new Error('Ledger failed to register the BTC wallet policy');
      }
      return [
        Buffer.from(result.policyIdHex, 'hex'),
        Buffer.from(result.hmacHex, 'hex'),
      ];
    },
    [deviceRequest],
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
        prepareTransportForOnboarding,
        initLedgerTransport,
        hasLedgerTransport: hasDevice,
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
        registerSubscriber,
        unregisterSubscriber,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedgerContext() {
  return useContext(LedgerContext);
}
