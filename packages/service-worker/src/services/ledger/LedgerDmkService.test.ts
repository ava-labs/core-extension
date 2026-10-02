import { of, throwError } from 'rxjs';
import { LedgerDmkService } from './LedgerDmkService';

const mockBuild = jest.fn();

jest.mock('@ledgerhq/device-management-kit', () => ({
  DeviceActionStatus: {},
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
jest.mock('@avalabs/core-wallets-sdk', () => ({}));
jest.mock('@core/common', () => ({}));
jest.mock('ledger-bitcoin', () => ({}));

const device = { id: 'device-id' };

const createDmk = () => ({
  listenToAvailableDevices: jest.fn(() => of([device])),
  connect: jest.fn(),
  disconnect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn(),
  getDeviceSessionState: jest.fn(),
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
