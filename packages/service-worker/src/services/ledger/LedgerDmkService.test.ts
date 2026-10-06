import { of, Subject, throwError } from 'rxjs';
import {
  getLedgerExtendedPublicKey,
  quitLedgerApp,
} from '@avalabs/core-wallets-sdk';
import { ensureLedgerAppOpen } from '@core/common';
import {
  LEDGER_DEVICE_LOCKED_ERROR,
  LEDGER_MULTIPLE_DEVICES_ERROR,
} from '@core/types';
import { LedgerDmkService } from './LedgerDmkService';
import { DmkLedgerTransport } from './dmk/DmkLedgerTransport';

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
}));
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
  ensureLedgerAppOpen: jest.fn(),
}));
const device = { id: 'device-id' };

const createDmk = () => ({
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
  sendApdu: jest.fn(),
});

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
      dmk.sendApdu.mockResolvedValue({
        data: new Uint8Array([0x01, 0x01, 0x0a, 0x02]),
        statusCode: new Uint8Array([0x90, 0x00]),
      });

      await expect(service.getEthAppConfig()).resolves.toEqual({
        isBlindSigningEnabled: true,
      });
      expect(dmk.sendApdu).toHaveBeenCalledWith({
        sessionId: 'session-1',
        apdu: new Uint8Array([0xe0, 0x06, 0x00, 0x00, 0x00]),
      });
    });

    it('opens the requested app through the DMK transport', async () => {
      await service.ensureAppOpen('Avalanche');

      expect(ensureLedgerAppOpen).toHaveBeenCalledWith(
        expect.any(DmkLedgerTransport),
        'Avalanche',
      );
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
      expect(ensureLedgerAppOpen).toHaveBeenCalledWith(
        expect.any(DmkLedgerTransport),
        'Avalanche',
      );
      expect(getLedgerExtendedPublicKey).toHaveBeenCalledWith(
        dmk,
        'session-1',
        true,
        "m/44'/60'/0'",
      );
    });

    it('reuses the established session across operations', async () => {
      await service.getTransport();
      await service.getSession();

      expect(dmk.connect).toHaveBeenCalledTimes(1);
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
