import {
  ExtensionRequest,
  LEDGER_DEVICE_LOCKED_ERROR,
  LEDGER_MULTIPLE_DEVICES_ERROR,
  LockEvents,
} from '@core/types';
import {
  act,
  fireEvent,
  render,
  waitFor,
  screen,
  cleanup,
} from '@shared/tests/test-utils';
import { useState } from 'react';
import { Subject } from 'rxjs';

import { useConnectionContext } from '../ConnectionProvider';
import {
  LedgerAppType,
  LedgerContextProvider,
  useActiveLedgerAppInfo,
  useLedgerContext,
} from '.';
import {
  DerivationPath,
  getAddressPublicKeyFromXPub,
} from '@avalabs/core-wallets-sdk';
import { getEvmExtendedKeyPath } from '@core/common';

jest.mock('../ConnectionProvider', () => {
  const connectionFunctions = {
    request: jest.fn(),
    events: jest.fn(),
  };
  return {
    useConnectionContext: () => connectionFunctions,
  };
});

jest.mock('../WalletProvider', () => ({
  useWalletContext: () => ({ isLedgerWallet: false }),
}));

jest.mock('@avalabs/core-wallets-sdk', () => ({
  DerivationPath: { BIP44: 'bip44', LedgerLive: 'ledger_live' },
  ETH_ACCOUNT_PATH: "m/44'/60'/0'/0/0",
  getAddressPublicKeyFromXPub: jest.fn(),
}));

jest.mock('@core/common', () => ({
  resolve: (promise: Promise<unknown>) =>
    promise.then((res) => [res, null]).catch((err) => [null, err]),
  isLockStateChangedEvent: (evt: { name: string }) =>
    evt.name === LockEvents.LOCK_STATE_CHANGED,
  getEvmExtendedKeyPath: jest.fn((index: number) => `m/44'/60'/${index}'`),
}));

type DeviceResponders = Partial<
  Record<string, (params: Record<string, unknown>) => unknown>
>;

let deviceResponders: DeviceResponders;

const defaultDeviceResponders = (): DeviceResponders => ({
  getAppInfo: () => ({
    applicationName: LedgerAppType.BITCOIN,
    version: '1.0.0',
  }),
  getEthAppConfig: () => ({ isBlindSigningEnabled: false }),
  ensureAppOpen: () => null,
  closeApp: () => null,
  getExtendedPublicKey: () => ({ xpub: 'default-xpub' }),
  getSolanaPublicKey: () => ({ publicKeyHex: '010203' }),
  getBtcMasterFingerprint: () => ({ fingerprint: 'default-fingerprint' }),
  getBtcExtendedPublicKey: () => ({ xpub: 'default-btc-xpub' }),
  registerBtcWalletPolicy: () => ({ hmacHex: 'bb' }),
});

const TestComponent = ({ methodParams }) => {
  const {
    initLedgerTransport,
    hasLedgerTransport,
    hasMultipleDevices,
    isDeviceLocked,
    wasTransportAttempted,
    ledgerVersionWarningClosed,
    getExtendedPublicKey,
    getPublicKey,
    popDeviceSelection,
    getMasterFingerprint,
    closeCurrentApp,
    getBtcExtendedPublicKey,
    registerBtcWalletPolicy,
    updateLedgerVersionWarningClosed,
    prepareTransportForOnboarding,
    registerSubscriber,
    unregisterSubscriber,
  } = useLedgerContext();

  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<unknown | undefined>();
  const methods = {
    initLedgerTransport,
    getExtendedPublicKey,
    getPublicKey,
    popDeviceSelection,
    getMasterFingerprint,
    closeCurrentApp,
    getBtcExtendedPublicKey,
    registerBtcWalletPolicy,
    updateLedgerVersionWarningClosed,
    prepareTransportForOnboarding,
    registerSubscriber,
    unregisterSubscriber,
  };

  const { appType, appVersion, appConfig } = useActiveLedgerAppInfo();

  return (
    <>
      {Object.keys(methods).map((method) => (
        <button
          key={method}
          data-testid={method}
          onClick={async () => {
            try {
              setResult(await methods[method](...methodParams));
            } catch (err) {
              setError((err as Error).message);
            }
          }}
        >
          {method}
        </button>
      ))}

      <span data-testid="error">{`${error}`}</span>
      <span data-testid="result">{`${result}`}</span>
      <span data-testid="wasTransportAttempted">{`${wasTransportAttempted}`}</span>
      <span data-testid="hasLedgerTransport">{`${hasLedgerTransport}`}</span>
      <span data-testid="hasMultipleDevices">{`${hasMultipleDevices}`}</span>
      <span data-testid="isDeviceLocked">{`${isDeviceLocked}`}</span>
      <span data-testid="appType">{appType}</span>
      <span data-testid="avaxAppVersion">{appVersion}</span>
      <span data-testid="isBlindSigningEnabled">
        {`${appConfig?.isBlindSigningEnabled}`}
      </span>
      <span data-testid="ledgerVersionWarningClosed">
        {`${ledgerVersionWarningClosed}`}
      </span>
    </>
  );
};

const renderTestComponent = (...args: unknown[]) => {
  return render(
    <LedgerContextProvider>
      <TestComponent methodParams={args}></TestComponent>
    </LedgerContextProvider>,
  );
};

const deviceRequestCall = (
  op: string,
  extra: Record<string, unknown> = {},
) => ({
  method: ExtensionRequest.LEDGER_DEVICE_REQUEST,
  params: [{ op, ...extra }],
});

describe('src/contexts/LedgerProvider.tsx', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    deviceResponders = defaultDeviceResponders();

    const connectionMocks = useConnectionContext();
    (connectionMocks.events as jest.Mock).mockReturnValue(new Subject());
    (connectionMocks.request as jest.Mock).mockImplementation(async (req) => {
      switch (req.method) {
        case ExtensionRequest.SHOW_LEDGER_VERSION_WARNING:
          return false;
        case ExtensionRequest.LEDGER_VERSION_WARNING_CLOSED:
          return true;
        case ExtensionRequest.LEDGER_DEVICE_REQUEST: {
          const [params] = req.params;
          const responder = deviceResponders[params.op];
          if (!responder) {
            throw new Error(`Unexpected ledger op: ${params.op}`);
          }
          return responder(params);
        }
        default:
          return undefined;
      }
    });

    jest
      .mocked(getEvmExtendedKeyPath)
      .mockImplementation((index: number) => `m/44'/60'/${index}'`);
  });

  afterEach(() => {
    cleanup();
  });

  describe('ledger version warning', () => {
    it('reflects the persisted warning flag on mount', async () => {
      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockImplementation(async (req) => {
        if (req.method === ExtensionRequest.SHOW_LEDGER_VERSION_WARNING) {
          return true;
        }
        return undefined;
      });

      renderTestComponent();

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.SHOW_LEDGER_VERSION_WARNING,
        });
        expect(
          screen.getByTestId('ledgerVersionWarningClosed').textContent,
        ).toBe('true');
      });
    });

    it('resets the warning flag to false when the extension gets locked', async () => {
      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderTestComponent();

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.SHOW_LEDGER_VERSION_WARNING,
        });
      });

      eventSubject.next({ name: LockEvents.LOCK_STATE_CHANGED, value: true });

      await waitFor(() => {
        expect(
          screen.getByTestId('ledgerVersionWarningClosed').textContent,
        ).toBe('false');
      });
    });

    it('ignores non-lock connection events', async () => {
      const eventSubject = new Subject();
      const connectionMocks = useConnectionContext();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);
      (connectionMocks.request as jest.Mock).mockImplementation(async (req) => {
        if (req.method === ExtensionRequest.SHOW_LEDGER_VERSION_WARNING) {
          return true;
        }
        return undefined;
      });

      renderTestComponent();

      await waitFor(() => {
        expect(
          screen.getByTestId('ledgerVersionWarningClosed').textContent,
        ).toBe('true');
      });

      eventSubject.next({ name: 'some-unrelated-event', value: {} });

      await waitFor(() => {
        expect(
          screen.getByTestId('ledgerVersionWarningClosed').textContent,
        ).toBe('true');
      });
    });
  });

  describe('updateLedgerVersionWarningClosed', () => {
    it('persists the closed flag via the service worker', async () => {
      const connectionMocks = useConnectionContext();
      renderTestComponent();

      fireEvent.click(screen.getByTestId('updateLedgerVersionWarningClosed'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith({
          method: ExtensionRequest.LEDGER_VERSION_WARNING_CLOSED,
        });
        expect(
          screen.getByTestId('ledgerVersionWarningClosed').textContent,
        ).toBe('true');
      });
    });
  });

  describe('initLedgerTransport', () => {
    it('marks the transport as attempted and available for a connected device', async () => {
      deviceResponders.getAppInfo = () => ({
        applicationName: LedgerAppType.AVALANCHE,
        version: '2.3.4',
      });

      const connectionMocks = useConnectionContext();
      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('getAppInfo'),
        );
        expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.AVALANCHE,
        );
        expect(screen.getByTestId('avaxAppVersion').textContent).toBe('2.3.4');
      });
    });

    it('reports no transport when the device has no active app', async () => {
      deviceResponders.getAppInfo = () => null;

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'false',
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.UNKNOWN,
        );
      });
    });

    it('flags multiple connected Ledgers until a single device is found', async () => {
      deviceResponders.getAppInfo = () => {
        throw LEDGER_MULTIPLE_DEVICES_ERROR;
      };

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(screen.getByTestId('hasMultipleDevices').textContent).toBe(
          'true',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'false',
        );
      });

      deviceResponders.getAppInfo = () => ({
        applicationName: LedgerAppType.AVALANCHE,
        version: '2.3.4',
      });
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(screen.getByTestId('hasMultipleDevices').textContent).toBe(
          'false',
        );
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'true',
        );
      });
    });

    it('does not flag multiple Ledgers for other connection errors', async () => {
      deviceResponders.getAppInfo = () => {
        throw 'Timeout';
      };

      renderTestComponent();
      await act(async () => {
        fireEvent.click(screen.getByTestId('initLedgerTransport'));
      });

      expect(screen.getByTestId('wasTransportAttempted').textContent).toBe(
        'true',
      );
      expect(screen.getByTestId('hasMultipleDevices').textContent).toBe(
        'false',
      );
      expect(screen.getByTestId('isDeviceLocked').textContent).toBe('false');
    });

    it('flags a locked Ledger until the device is unlocked', async () => {
      deviceResponders.getAppInfo = () => {
        throw LEDGER_DEVICE_LOCKED_ERROR;
      };

      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(screen.getByTestId('isDeviceLocked').textContent).toBe('true');
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'false',
        );
      });

      deviceResponders.getAppInfo = () => ({
        applicationName: LedgerAppType.AVALANCHE,
        version: '2.3.4',
      });
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(screen.getByTestId('isDeviceLocked').textContent).toBe('false');
        expect(screen.getByTestId('hasLedgerTransport').textContent).toBe(
          'true',
        );
      });
    });

    it('queries the Ethereum app config when the Ethereum app is open', async () => {
      deviceResponders.getAppInfo = () => ({
        applicationName: LedgerAppType.ETHEREUM,
        version: '1.0.0',
      });

      const connectionMocks = useConnectionContext();
      renderTestComponent();
      fireEvent.click(screen.getByTestId('initLedgerTransport'));

      await waitFor(() => {
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.ETHEREUM,
        );
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('getEthAppConfig'),
        );
      });
    });

    describe('Ethereum app config', () => {
      const openApp = (applicationName: LedgerAppType) => {
        deviceResponders.getAppInfo = () => ({
          applicationName,
          version: '1.0.0',
        });
        fireEvent.click(screen.getByTestId('initLedgerTransport'));
      };

      const blindSigning = () =>
        screen.getByTestId('isBlindSigningEnabled').textContent;

      beforeEach(async () => {
        deviceResponders.getEthAppConfig = () => ({
          isBlindSigningEnabled: true,
        });
        renderTestComponent();
        openApp(LedgerAppType.ETHEREUM);
        await waitFor(() => expect(blindSigning()).toBe('true'));
      });

      it('keeps the last known config when a read fails while the device is busy', async () => {
        const failedRead = jest.fn(() => {
          throw 'Device is busy';
        });
        deviceResponders.getEthAppConfig = failedRead;

        openApp(LedgerAppType.ETHEREUM);

        await waitFor(() => expect(failedRead).toHaveBeenCalled());
        await act(async () => {});
        expect(blindSigning()).toBe('true');
      });

      it('clears the config once another app is opened', async () => {
        openApp(LedgerAppType.AVALANCHE);

        await waitFor(() => expect(blindSigning()).toBe('undefined'));
      });

      it('clears the config when the device goes away', async () => {
        deviceResponders.getAppInfo = () => null;
        fireEvent.click(screen.getByTestId('initLedgerTransport'));

        await waitFor(() => expect(blindSigning()).toBe('undefined'));
      });
    });
  });

  describe('getExtendedPublicKey', () => {
    it('returns the extended public key for the given path', async () => {
      const path = "m/44'/60'/0'";
      deviceResponders.getExtendedPublicKey = () => ({ xpub: 'the-xpub' });

      const connectionMocks = useConnectionContext();
      renderTestComponent(path);
      fireEvent.click(screen.getByTestId('getExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe('the-xpub');
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('getExtendedPublicKey', { path }),
        );
      });
    });

    it('surfaces device errors', async () => {
      const path = "m/44'/60'/0'";
      deviceResponders.getExtendedPublicKey = () => {
        throw new Error('some device error');
      };

      renderTestComponent(path);
      fireEvent.click(screen.getByTestId('getExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'some device error',
        );
      });
    });

    it('throws when the device returns no extended public key', async () => {
      deviceResponders.getExtendedPublicKey = () => ({});

      renderTestComponent("m/44'/60'/0'");
      fireEvent.click(screen.getByTestId('getExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'Ledger returned no extended public key',
        );
      });
    });
  });

  describe('getPublicKey', () => {
    it('derives the EVM public key from the account extended public key', async () => {
      deviceResponders.getExtendedPublicKey = () => ({ xpub: 'evm-xpub' });
      jest
        .mocked(getAddressPublicKeyFromXPub)
        .mockReturnValue(Buffer.from('cafe', 'hex'));

      const connectionMocks = useConnectionContext();
      renderTestComponent(1, DerivationPath.BIP44, 'EVM');
      fireEvent.click(screen.getByTestId('getPublicKey'));

      await waitFor(() => {
        expect(getEvmExtendedKeyPath).toHaveBeenCalledWith(0);
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('getExtendedPublicKey', { path: "m/44'/60'/0'" }),
        );
        expect(getAddressPublicKeyFromXPub).toHaveBeenCalledWith('evm-xpub', 1);
      });
    });

    it('requests the Solana public key for SVM accounts', async () => {
      deviceResponders.getSolanaPublicKey = () => ({ publicKeyHex: 'aabbcc' });

      const connectionMocks = useConnectionContext();
      renderTestComponent(2, DerivationPath.LedgerLive, 'SVM');
      fireEvent.click(screen.getByTestId('getPublicKey'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('getSolanaPublicKey', { accountIndex: 2 }),
        );
        expect(getAddressPublicKeyFromXPub).not.toHaveBeenCalled();
      });
    });

    it('throws when the device returns no Solana public key', async () => {
      deviceResponders.getSolanaPublicKey = () => ({});

      renderTestComponent(0, DerivationPath.LedgerLive, 'SVM');
      fireEvent.click(screen.getByTestId('getPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'Ledger returned no Solana public key',
        );
      });
    });
  });

  describe('popDeviceSelection', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        configurable: true,
      });
    });

    const stubHid = (requestDevice: jest.Mock) => {
      Object.defineProperty(global, 'navigator', {
        value: { ...originalNavigator, hid: { requestDevice } },
        configurable: true,
      });
    };

    it('refreshes the active app once access is granted', async () => {
      const requestDevice = jest.fn().mockResolvedValue([{}]);
      stubHid(requestDevice);

      const connectionMocks = useConnectionContext();
      renderTestComponent();
      fireEvent.click(screen.getByTestId('popDeviceSelection'));

      await waitFor(() => {
        expect(requestDevice).toHaveBeenCalled();
        expect(screen.getByTestId('result').textContent).toBe('true');
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('getAppInfo'),
        );
      });
    });

    it('throws when no device is granted', async () => {
      const requestDevice = jest.fn().mockResolvedValue([]);
      stubHid(requestDevice);

      renderTestComponent();
      fireEvent.click(screen.getByTestId('popDeviceSelection'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'Ledger device selection failed',
        );
      });
    });

    it('does not re-prompt WebHID after a grant, even if the device is locked', async () => {
      const requestDevice = jest.fn().mockResolvedValue([{}]);
      stubHid(requestDevice);
      deviceResponders.getAppInfo = () => {
        throw LEDGER_DEVICE_LOCKED_ERROR;
      };

      renderTestComponent();
      fireEvent.click(screen.getByTestId('popDeviceSelection'));

      await waitFor(() => {
        expect(screen.getByTestId('isDeviceLocked').textContent).toBe('true');
      });
      expect(requestDevice).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByTestId('popDeviceSelection'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe('true');
      });
      expect(requestDevice).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMasterFingerprint', () => {
    it('returns the master fingerprint from the device', async () => {
      deviceResponders.getBtcMasterFingerprint = () => ({
        fingerprint: 'deadbeef',
      });

      const connectionMocks = useConnectionContext();
      renderTestComponent();
      fireEvent.click(screen.getByTestId('getMasterFingerprint'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe('deadbeef');
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('getBtcMasterFingerprint'),
        );
      });
    });

    it('throws when the device returns no fingerprint', async () => {
      deviceResponders.getBtcMasterFingerprint = () => ({});

      renderTestComponent();
      fireEvent.click(screen.getByTestId('getMasterFingerprint'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'Ledger returned no master fingerprint',
        );
      });
    });
  });

  describe('getBtcExtendedPublicKey', () => {
    it('returns the BTC extended public key for the given path', async () => {
      const path = "m/84'/0'/0'";
      deviceResponders.getBtcExtendedPublicKey = () => ({ xpub: 'btc-xpub' });

      const connectionMocks = useConnectionContext();
      renderTestComponent(path);
      fireEvent.click(screen.getByTestId('getBtcExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('result').textContent).toBe('btc-xpub');
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('getBtcExtendedPublicKey', { path }),
        );
      });
    });

    it('throws when the device returns no BTC extended public key', async () => {
      deviceResponders.getBtcExtendedPublicKey = () => ({});

      renderTestComponent("m/84'/0'/0'");
      fireEvent.click(screen.getByTestId('getBtcExtendedPublicKey'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'Ledger returned no BTC extended public key',
        );
      });
    });
  });

  describe('registerBtcWalletPolicy', () => {
    it('registers the policy and returns the hmac', async () => {
      deviceResponders.registerBtcWalletPolicy = () => ({ hmacHex: 'bb' });

      const connectionMocks = useConnectionContext();
      renderTestComponent('the-xpub', 'the-fingerprint', "m/84'/0'/0'", 'name');
      fireEvent.click(screen.getByTestId('registerBtcWalletPolicy'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('registerBtcWalletPolicy', {
            xpub: 'the-xpub',
            masterFingerprint: 'the-fingerprint',
            derivationPath: "m/84'/0'/0'",
            name: 'name',
          }),
        );
        expect(screen.getByTestId('error').textContent).toBe('undefined');
        expect(screen.getByTestId('result').textContent).toBe(
          `${Buffer.from('bb', 'hex')}`,
        );
      });
    });

    it('throws when the device fails to register the policy', async () => {
      deviceResponders.registerBtcWalletPolicy = () => ({});

      renderTestComponent('the-xpub', 'the-fingerprint', "m/84'/0'/0'", 'name');
      fireEvent.click(screen.getByTestId('registerBtcWalletPolicy'));

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe(
          'Ledger failed to register the BTC wallet policy',
        );
      });
    });
  });

  describe('closeCurrentApp', () => {
    it('closes the app and resets the active app type', async () => {
      deviceResponders.getAppInfo = () => ({
        applicationName: LedgerAppType.BITCOIN,
        version: '1.0.0',
      });

      const connectionMocks = useConnectionContext();
      renderTestComponent();

      fireEvent.click(screen.getByTestId('initLedgerTransport'));
      await waitFor(() => {
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.BITCOIN,
        );
      });

      fireEvent.click(screen.getByTestId('closeCurrentApp'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('closeApp'),
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.UNKNOWN,
        );
      });
    });
  });

  describe('prepareTransportForOnboarding', () => {
    it('opens the requested app and refreshes the active app', async () => {
      deviceResponders.getAppInfo = () => ({
        applicationName: LedgerAppType.SOLANA,
        version: '1.4.0',
      });

      const connectionMocks = useConnectionContext();
      renderTestComponent(LedgerAppType.SOLANA);

      fireEvent.click(screen.getByTestId('prepareTransportForOnboarding'));

      await waitFor(() => {
        expect(connectionMocks.request).toHaveBeenCalledWith(
          deviceRequestCall('ensureAppOpen', { appName: LedgerAppType.SOLANA }),
        );
        expect(screen.getByTestId('appType').textContent).toBe(
          LedgerAppType.SOLANA,
        );
      });
    });
  });

  describe('active app polling', () => {
    it('polls the device every 2 seconds while there are subscribers', async () => {
      const { request } = useConnectionContext();
      const getAppInfoCalls = () =>
        (request as jest.Mock).mock.calls.filter(
          ([req]) =>
            req.method === ExtensionRequest.LEDGER_DEVICE_REQUEST &&
            req.params[0].op === 'getAppInfo',
        ).length;

      renderTestComponent();
      expect(getAppInfoCalls()).toBe(0);

      await act(async () => {
        fireEvent.click(screen.getByTestId('registerSubscriber'));
      });
      expect(getAppInfoCalls()).toBe(1);

      await act(() => jest.advanceTimersByTimeAsync(2_000));
      expect(getAppInfoCalls()).toBe(2);

      fireEvent.click(screen.getByTestId('unregisterSubscriber'));
      await act(() => jest.advanceTimersByTimeAsync(10_000));
      expect(getAppInfoCalls()).toBe(2);
    });

    it('stops polling when the last subscriber leaves during a pending device request', async () => {
      const { request } = useConnectionContext();
      const getAppInfoCalls = () =>
        (request as jest.Mock).mock.calls.filter(
          ([req]) =>
            req.method === ExtensionRequest.LEDGER_DEVICE_REQUEST &&
            req.params[0].op === 'getAppInfo',
        ).length;

      let settleAppInfo!: (info: unknown) => void;
      deviceResponders.getAppInfo = () =>
        new Promise((resolve) => {
          settleAppInfo = resolve;
        });

      renderTestComponent();

      fireEvent.click(screen.getByTestId('registerSubscriber'));
      await waitFor(() => expect(getAppInfoCalls()).toBe(1));

      fireEvent.click(screen.getByTestId('unregisterSubscriber'));
      await act(async () => {
        settleAppInfo({
          applicationName: LedgerAppType.AVALANCHE,
          version: '1.0.0',
        });
      });
      await act(() => jest.advanceTimersByTimeAsync(10_000));

      expect(getAppInfoCalls()).toBe(1);
    });
  });
});
