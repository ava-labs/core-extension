import { of, Subject, throwError } from 'rxjs';
import {
  getLedgerExtendedPublicKey,
  quitLedgerApp,
} from '@avalabs/core-wallets-sdk';
import { OpenAppDeviceAction } from '@ledgerhq/device-management-kit';
import { GetAppConfiguration } from '@ledgerhq/device-signer-kit-ethereum/internal/app-binder/command/GetAppConfigurationCommand.js';
import {
  LEDGER_DEVICE_LOCKED_ERROR,
  LEDGER_MULTIPLE_DEVICES_ERROR,
} from '@core/types';
import { LedgerDmkService } from './LedgerDmkService';

const mockBuild = jest.fn();
const mockBtcSigner = {
  getMasterFingerprint: jest.fn(),
  getExtendedPublicKey: jest.fn(),
  registerWallet: jest.fn(),
};

jest.mock('@ledgerhq/device-management-kit', () => ({
  DeviceActionStatus: { Completed: 'completed', Error: 'error' },
  DeviceStatus: { LOCKED: 'LOCKED', BUSY: 'BUSY', CONNECTED: 'CONNECTED' },
  DeviceManagementKitBuilder: class {
    addTransport() {
      return this;
    }
    build() {
      return mockBuild();
    }
  },
  OpenAppDeviceAction: class {
    constructor(readonly args: { input: { appName: string } }) {}
  },
  isSuccessCommandResult: (result: { status: string }) =>
    result.status === 'SUCCESS',
}));
jest.mock(
  '@ledgerhq/device-signer-kit-ethereum/internal/app-binder/command/GetAppConfigurationCommand.js',
  () => ({ GetAppConfiguration: class {} }),
);
jest.mock('@ledgerhq/device-signer-kit-solana', () => ({}));
jest.mock('@ledgerhq/device-signer-kit-bitcoin', () => ({
  DefaultDescriptorTemplate: { NATIVE_SEGWIT: 'wpkh(@0/**)' },
  SignerBtcBuilder: class {
    build() {
      return mockBtcSigner;
    }
  },
  WalletPolicy: class {
    constructor(
      readonly name: string,
      readonly descriptorTemplate: string,
      readonly keys: string[],
    ) {}
  },
}));
jest.mock('@avalabs/core-wallets-sdk', () => ({
  getLedgerExtendedPublicKey: jest.fn(),
  quitLedgerApp: jest.fn(),
}));
jest.mock('@core/common', () => ({
  getLedgerAppNotInstalledMessage: (appName: string) =>
    `${appName} not installed`,
  getLedgerAutoOpenAppFailedMessage: (appName: string) =>
    `Could not open ${appName}`,
  getSolanaRpcUrl: () => 'https://solana.example',
}));
const device = { id: 'device-id' };

const createDmk = () => {
  const resumeRefresher = jest.fn();
  return {
    listenToAvailableDevices: jest.fn(() => of([device])),
    connect: jest.fn(),
    disconnect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn(),
    getDeviceSessionState: jest.fn(() =>
      of({
        deviceStatus: 'CONNECTED',
        currentApp: { name: 'Avalanche', version: '1.0.0' },
      }),
    ) as jest.Mock,
    sendCommand: jest.fn(),
    resumeRefresher,
    disableDeviceSessionRefresher: jest.fn(() => resumeRefresher),
    executeDeviceAction: jest.fn(() => ({
      observable: of({ status: 'completed', output: undefined }),
    })) as jest.Mock,
  };
};

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

describe('src/background/services/ledger/LedgerDmkService.ts', () => {
  let service: LedgerDmkService;

  beforeEach(() => {
    service = new LedgerDmkService();
  });

  afterEach(async () => {
    await service.disconnect();
  });

  describe('releasing the device', () => {
    let dmk: ReturnType<typeof createDmk>;

    beforeEach(() => {
      jest.useFakeTimers();
      dmk = createDmk();
      dmk.connect.mockResolvedValue('session-1');
      mockBuild.mockReturnValue(dmk);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const getSession = async () => {
      const pending = service.getSession();
      await jest.advanceTimersByTimeAsync(0);
      return pending;
    };

    it('disconnects after a period without requests', async () => {
      await getSession();

      await jest.advanceTimersByTimeAsync(4_999);
      expect(dmk.disconnect).not.toHaveBeenCalled();

      await jest.advanceTimersByTimeAsync(1);
      expect(dmk.disconnect).toHaveBeenCalledWith({ sessionId: 'session-1' });
    });

    it('keeps the session while requests keep coming', async () => {
      await getSession();
      await jest.advanceTimersByTimeAsync(4_000);
      await getSession();
      await jest.advanceTimersByTimeAsync(4_000);

      expect(dmk.disconnect).not.toHaveBeenCalled();
    });

    it('reconnects on the next request after releasing', async () => {
      dmk.connect
        .mockResolvedValueOnce('session-1')
        .mockResolvedValueOnce('session-2');

      await getSession();
      await jest.advanceTimersByTimeAsync(5_000);

      await expect(getSession()).resolves.toEqual({
        dmk,
        sessionId: 'session-2',
      });
    });

    it('does not release the device during an operation', async () => {
      const operation = deferred<void>();
      const pending = service.runDeviceOperation(() => operation.promise);

      await jest.advanceTimersByTimeAsync(60_000);
      expect(dmk.disconnect).not.toHaveBeenCalled();

      operation.resolve();
      await pending;
      await jest.advanceTimersByTimeAsync(5_000);
      expect(dmk.disconnect).toHaveBeenCalledWith({ sessionId: 'session-1' });
    });

    it('releases the device as soon as all extension windows close', async () => {
      await getSession();

      service.onAllExtensionsClosed();
      await jest.advanceTimersByTimeAsync(0);

      expect(dmk.disconnect).toHaveBeenCalledWith({ sessionId: 'session-1' });
    });

    it('waits for a running operation before releasing on close', async () => {
      const operation = deferred<void>();
      const pending = service.runDeviceOperation(() => operation.promise);
      await jest.advanceTimersByTimeAsync(0);

      service.onAllExtensionsClosed();
      await jest.advanceTimersByTimeAsync(0);
      expect(dmk.disconnect).not.toHaveBeenCalled();

      operation.resolve();
      await pending;
      expect(dmk.disconnect).toHaveBeenCalledWith({ sessionId: 'session-1' });
    });
  });

  describe('getAppInfo', () => {
    it('does not retry discovery when no device is available', async () => {
      const dmk = createDmk();
      dmk.listenToAvailableDevices.mockReturnValue(
        throwError(() => new Error('Timeout')),
      );
      mockBuild.mockReturnValue(dmk);

      await expect(service.getAppInfo()).rejects.toThrow('Timeout');
      expect(dmk.listenToAvailableDevices).toHaveBeenCalledTimes(1);
    });

    it('reconnects once when an established session is stale', async () => {
      const dmk = createDmk();
      dmk.connect
        .mockResolvedValueOnce('session-1')
        .mockResolvedValueOnce('session-2');
      dmk.getDeviceSessionState
        .mockReturnValueOnce(throwError(() => new Error('Timeout')))
        .mockReturnValueOnce(
          of({ currentApp: { name: 'Avalanche', version: '1.0.0' } }),
        );
      mockBuild.mockReturnValue(dmk);

      await expect(service.getAppInfo()).resolves.toEqual({
        applicationName: 'Avalanche',
        version: '1.0.0',
      });
      expect(dmk.disconnect).toHaveBeenCalledWith({ sessionId: 'session-1' });
      expect(dmk.getDeviceSessionState).toHaveBeenLastCalledWith({
        sessionId: 'session-2',
      });
    });

    it('fails immediately when the device is locked without reconnecting', async () => {
      const dmk = createDmk();
      dmk.connect.mockResolvedValue('session-1');
      dmk.getDeviceSessionState.mockReturnValue(of({ deviceStatus: 'LOCKED' }));
      mockBuild.mockReturnValue(dmk);

      await expect(service.getAppInfo()).rejects.toThrow(
        LEDGER_DEVICE_LOCKED_ERROR,
      );
      expect(dmk.disconnect).not.toHaveBeenCalled();
      expect(dmk.connect).toHaveBeenCalledTimes(1);
    });

    it('leaves a replacement session alone when a read from before lock fails', async () => {
      const oldDmk = createDmk();
      const newDmk = createDmk();
      const oldRead = new Subject<never>();
      oldDmk.connect.mockResolvedValue('session-1');
      oldDmk.getDeviceSessionState.mockReturnValue(oldRead);
      newDmk.connect.mockResolvedValue('session-2');
      mockBuild.mockReturnValueOnce(oldDmk).mockReturnValueOnce(newDmk);

      const pendingRead = service.getAppInfo();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(oldDmk.getDeviceSessionState).toHaveBeenCalled();

      service.onLock();
      await expect(service.getSession()).resolves.toEqual({
        dmk: newDmk,
        sessionId: 'session-2',
      });

      oldRead.error(new Error('Timeout'));

      await expect(pendingRead).rejects.toThrow('Timeout');
      expect(newDmk.disconnect).not.toHaveBeenCalled();
      await expect(service.getSession()).resolves.toEqual({
        dmk: newDmk,
        sessionId: 'session-2',
      });
      expect(newDmk.connect).toHaveBeenCalledTimes(1);
    });
  });

  describe('device discovery', () => {
    it('refuses to pick a device when several Ledgers are available', async () => {
      const dmk = createDmk();
      dmk.listenToAvailableDevices.mockReturnValue(
        of([device, { id: 'other-device-id' }]),
      );
      mockBuild.mockReturnValue(dmk);

      await expect(service.getSession()).rejects.toThrow(
        LEDGER_MULTIPLE_DEVICES_ERROR,
      );
      expect(dmk.connect).not.toHaveBeenCalled();
    });

    it('rechecks the permitted-device list until a Ledger appears', async () => {
      jest.useFakeTimers();
      const dmk = createDmk();
      dmk.listenToAvailableDevices
        .mockReturnValueOnce(of([]))
        .mockReturnValueOnce(of([device]));
      dmk.connect.mockResolvedValue('session-1');
      mockBuild.mockReturnValue(dmk);

      try {
        const pending = service.getSession();
        await jest.advanceTimersByTimeAsync(0);
        expect(dmk.listenToAvailableDevices).toHaveBeenCalledTimes(1);
        expect(dmk.connect).not.toHaveBeenCalled();

        await jest.advanceTimersByTimeAsync(1_000);
        await expect(pending).resolves.toEqual({
          dmk,
          sessionId: 'session-1',
        });
        expect(dmk.listenToAvailableDevices).toHaveBeenCalledTimes(2);
      } finally {
        jest.useRealTimers();
      }
    });

    it('connects to the only available Ledger', async () => {
      const dmk = createDmk();
      dmk.connect.mockResolvedValue('session-1');
      mockBuild.mockReturnValue(dmk);

      await expect(service.getSession()).resolves.toEqual({
        dmk,
        sessionId: 'session-1',
      });
      expect(dmk.connect).toHaveBeenCalledWith({ device });
    });
  });

  describe('device operations', () => {
    let dmk: ReturnType<typeof createDmk>;

    beforeEach(() => {
      dmk = createDmk();
      dmk.connect.mockResolvedValue('session-1');
      mockBuild.mockReturnValue(dmk);
    });

    it('reads the blind-signing flag from the Ethereum app configuration', async () => {
      dmk.sendCommand.mockResolvedValue({
        status: 'SUCCESS',
        data: { blindSigningEnabled: true, version: '1.10.2' },
      });

      await expect(service.getEthAppConfig()).resolves.toEqual({
        isBlindSigningEnabled: true,
      });
      expect(dmk.sendCommand).toHaveBeenCalledWith({
        sessionId: 'session-1',
        command: expect.any(GetAppConfiguration),
      });
    });

    it('surfaces Ethereum app configuration errors', async () => {
      dmk.sendCommand.mockResolvedValue({
        status: 'ERROR',
        error: { _tag: 'EthAppCommandError', errorCode: '6d00' },
      });

      await expect(service.getEthAppConfig()).rejects.toThrow(
        'Ethereum getAppConfiguration failed: {"_tag":"EthAppCommandError","errorCode":"6d00"}',
      );
    });

    it('opens the requested app with the DMK open-app device action', async () => {
      await service.ensureAppOpen('Bitcoin Recovery');

      expect(dmk.executeDeviceAction).toHaveBeenCalledWith({
        sessionId: 'session-1',
        deviceAction: expect.any(OpenAppDeviceAction),
      });
      expect(
        dmk.executeDeviceAction.mock.calls[0][0].deviceAction.args,
      ).toEqual({ input: { appName: 'Bitcoin Recovery' } });
    });

    it.each([
      [
        'a locked device',
        { _tag: 'DeviceLockedError' },
        LEDGER_DEVICE_LOCKED_ERROR,
      ],
      [
        'a missing app',
        { _tag: 'GlobalCommandError', errorCode: '5123' },
        'Solana not installed',
      ],
      [
        'a rejected switch',
        { _tag: 'OpenAppCommandError', errorCode: '6807' },
        'Could not open Solana',
      ],
    ])('maps %s to a user-facing error', async (_, error, message) => {
      dmk.executeDeviceAction.mockReturnValue({
        observable: of({ status: 'error', error }),
      });

      await expect(service.ensureAppOpen('Solana')).rejects.toThrow(message);
    });

    it('quits the running app', async () => {
      await service.closeApp();

      expect(quitLedgerApp).toHaveBeenCalledWith(dmk, 'session-1');
    });

    it('derives the extended public key from the Avalanche app', async () => {
      jest.mocked(getLedgerExtendedPublicKey).mockResolvedValue('xpub');

      await expect(
        service.getExtendedPublicKey("m/44'/60'/0'", true),
      ).resolves.toBe('xpub');
      expect(
        dmk.executeDeviceAction.mock.calls[0][0].deviceAction.args,
      ).toEqual({ input: { appName: 'Avalanche' } });
      expect(getLedgerExtendedPublicKey).toHaveBeenCalledWith(
        dmk,
        'session-1',
        true,
        "m/44'/60'/0'",
      );
    });

    it('reuses the established session across operations', async () => {
      await service.closeApp();
      await service.getSession();

      expect(dmk.connect).toHaveBeenCalledTimes(1);
    });
  });

  describe('runDeviceOperation', () => {
    let dmk: ReturnType<typeof createDmk>;

    beforeEach(() => {
      dmk = createDmk();
      dmk.connect.mockResolvedValue('session-1');
      mockBuild.mockReturnValue(dmk);
    });

    it('pauses the session refresher for the duration of the operation', async () => {
      const operation = jest.fn(async () => {
        expect(dmk.resumeRefresher).not.toHaveBeenCalled();
        return 'done';
      });

      await expect(service.runDeviceOperation(operation)).resolves.toBe('done');
      expect(dmk.disableDeviceSessionRefresher).toHaveBeenCalledWith({
        sessionId: 'session-1',
        blockerId: expect.any(String),
      });
      expect(operation).toHaveBeenCalledWith({ dmk, sessionId: 'session-1' });
      expect(dmk.resumeRefresher).toHaveBeenCalledTimes(1);
    });

    it('does not wait for a BUSY session status to clear before running', async () => {
      dmk.getDeviceSessionState.mockReturnValue(of({ deviceStatus: 'BUSY' }));

      await expect(
        service.runDeviceOperation(async () => 'done'),
      ).resolves.toBe('done');
    });

    it('resumes the refresher when the operation fails', async () => {
      await expect(
        service.runDeviceOperation(async () => {
          throw new Error('user rejected');
        }),
      ).rejects.toThrow('user rejected');
      expect(dmk.resumeRefresher).toHaveBeenCalledTimes(1);
    });

    it('does not reset the session when app info fails mid-operation', async () => {
      const operation = deferred<void>();
      const pending = service.runDeviceOperation(() => operation.promise);
      await new Promise((resolve) => setTimeout(resolve, 0));

      dmk.getDeviceSessionState.mockReturnValue(
        throwError(() => new Error('Timeout')),
      );
      await expect(service.getAppInfo()).rejects.toThrow('Timeout');
      expect(dmk.disconnect).not.toHaveBeenCalled();

      operation.resolve();
      await pending;
    });
  });

  describe('Bitcoin', () => {
    const completed = (output: unknown) => ({
      observable: of({ status: 'completed', output }),
    });

    beforeEach(() => {
      const dmk = createDmk();
      dmk.connect.mockResolvedValue('session-1');
      mockBuild.mockReturnValue(dmk);
    });

    it('returns the master fingerprint hex-encoded without switching apps', async () => {
      mockBtcSigner.getMasterFingerprint.mockReturnValue(
        completed({ masterFingerprint: new Uint8Array([0xf0, 0x0d]) }),
      );

      await expect(service.getBtcMasterFingerprint()).resolves.toBe('f00d');
      expect(mockBtcSigner.getMasterFingerprint).toHaveBeenCalledWith({
        skipOpenApp: true,
      });
    });

    it('returns the extended public key verified on device', async () => {
      mockBtcSigner.getExtendedPublicKey.mockReturnValue(
        completed({ extendedPublicKey: 'xpub123' }),
      );

      await expect(
        service.getBtcExtendedPublicKey("m/44'/60'/0'"),
      ).resolves.toBe('xpub123');
      expect(mockBtcSigner.getExtendedPublicKey).toHaveBeenCalledWith(
        "44'/60'/0'",
        { checkOnDevice: true, skipOpenApp: true },
      );
    });

    it('registers a native segwit policy and returns its hmac', async () => {
      mockBtcSigner.registerWallet.mockReturnValue(
        completed({ hmac: new Uint8Array([0xab, 0xcd]) }),
      );

      await expect(
        service.registerBtcWalletPolicy(
          'xpub',
          'f00dbabe',
          "44'/60'/0'",
          'Core',
        ),
      ).resolves.toEqual(Buffer.from([0xab, 0xcd]));
      expect(mockBtcSigner.registerWallet).toHaveBeenCalledWith(
        {
          name: 'Core',
          descriptorTemplate: 'wpkh(@0/**)',
          keys: ["[f00dbabe/44'/60'/0']xpub"],
        },
        { skipOpenApp: true },
      );
    });

    it('surfaces device action errors', async () => {
      mockBtcSigner.getMasterFingerprint.mockReturnValue({
        observable: of({
          status: 'error',
          error: { _tag: 'DeviceLockedError' },
        }),
      });

      await expect(service.getBtcMasterFingerprint()).rejects.toThrow(
        'Bitcoin getMasterFingerprint failed (error): {"_tag":"DeviceLockedError"}',
      );
    });
  });

  describe('onLock', () => {
    it('does not reuse the previous session while it is being disconnected', async () => {
      const oldDmk = createDmk();
      const newDmk = createDmk();
      const oldDisconnect = deferred<void>();
      oldDmk.connect.mockResolvedValue('session-1');
      oldDmk.disconnect.mockReturnValue(oldDisconnect.promise);
      newDmk.connect.mockResolvedValue('session-2');
      mockBuild.mockReturnValueOnce(oldDmk).mockReturnValueOnce(newDmk);

      await service.getSession();
      service.onLock();

      await expect(service.getSession()).resolves.toEqual({
        dmk: newDmk,
        sessionId: 'session-2',
      });
      expect(oldDmk.disconnect).toHaveBeenCalledWith({
        sessionId: 'session-1',
      });
      expect(oldDmk.close).not.toHaveBeenCalled();

      oldDisconnect.resolve();
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(oldDmk.close).toHaveBeenCalled();
    });

    it('discards a connection that completes after the wallet was locked', async () => {
      const oldDmk = createDmk();
      const newDmk = createDmk();
      const oldConnect = deferred<string>();
      oldDmk.connect.mockReturnValue(oldConnect.promise);
      newDmk.connect.mockResolvedValue('session-2');
      mockBuild.mockReturnValueOnce(oldDmk).mockReturnValueOnce(newDmk);

      const pendingSession = service.getSession();
      await Promise.resolve();
      service.onLock();
      oldConnect.resolve('session-1');

      await expect(pendingSession).rejects.toThrow(
        'Ledger connection was reset',
      );
      expect(oldDmk.disconnect).toHaveBeenCalledWith({
        sessionId: 'session-1',
      });
      await expect(service.getSession()).resolves.toEqual({
        dmk: newDmk,
        sessionId: 'session-2',
      });
    });
  });
});
