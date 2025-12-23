import { AlarmsEvents, LockEvents } from '@core/types';
import { CallbackManager } from '~/runtime/CallbackManager';
import { StorageService } from '../storage/StorageService';
import { LockService } from './LockService';

jest.mock('~/runtime/CallbackManager');
jest.mock('../storage/StorageService');

const mockChromeAlarms = {
  create: jest.fn(),
  clear: jest.fn(),
  onAlarm: {
    addListener: jest.fn(),
  },
};

const mockChromeRuntime = {
  onConnect: {
    addListener: jest.fn(),
  },
};

(global as any).chrome = {
  alarms: mockChromeAlarms,
  runtime: mockChromeRuntime,
};

describe('src/services/lock/LockService.ts', () => {
  let callbackManager: jest.Mocked<CallbackManager>;
  let storageService: jest.Mocked<StorageService>;
  let lockService: LockService;

  beforeEach(() => {
    jest.clearAllMocks();

    callbackManager = {
      onLock: jest.fn(),
      onUnlock: jest.fn(),
      onStorageReady: jest.fn(),
      onAllExtensionsClosed: jest.fn(),
    } as unknown as jest.Mocked<CallbackManager>;

    storageService = {
      activate: jest.fn().mockResolvedValue(undefined),
      changePassword: jest.fn().mockResolvedValue(undefined),
      verifyPassword: jest.fn().mockResolvedValue(true),
      clearSessionStorage: jest.fn(),
    } as unknown as jest.Mocked<StorageService>;

    lockService = new LockService(callbackManager, storageService);
  });

  describe('locked getter', () => {
    it('returns true by default', () => {
      expect(lockService.locked).toBe(true);
    });

    it('returns false after successful unlock', async () => {
      await lockService.unlock('correct-password');

      expect(lockService.locked).toBe(false);
    });

    it('returns true after lock', async () => {
      await lockService.unlock('correct-password');
      expect(lockService.locked).toBe(false);

      lockService.lock();
      expect(lockService.locked).toBe(true);
    });
  });

  describe('activate', () => {
    it('sets up runtime onConnect listener that clears auto-lock alarm', async () => {
      await lockService.activate();

      expect(mockChromeRuntime.onConnect.addListener).toHaveBeenCalledTimes(1);

      const onConnectCallback =
        mockChromeRuntime.onConnect.addListener.mock.calls[0][0];
      onConnectCallback();

      expect(mockChromeAlarms.clear).toHaveBeenCalledWith(
        AlarmsEvents.AUTO_LOCK,
      );
    });

    it('sets up alarm listener that locks when auto-lock alarm fires', async () => {
      await lockService.unlock('password');

      await lockService.activate();

      expect(mockChromeAlarms.onAlarm.addListener).toHaveBeenCalledTimes(1);

      const onAlarmCallback =
        mockChromeAlarms.onAlarm.addListener.mock.calls[0][0];

      onAlarmCallback({ name: AlarmsEvents.AUTO_LOCK });

      expect(lockService.locked).toBe(true);
      expect(storageService.clearSessionStorage).toHaveBeenCalled();
      expect(callbackManager.onLock).toHaveBeenCalled();
    });

    it('does not lock when a different alarm fires', async () => {
      await lockService.unlock('password');

      await lockService.activate();

      const onAlarmCallback =
        mockChromeAlarms.onAlarm.addListener.mock.calls[0][0];

      onAlarmCallback({ name: 'some-other-alarm' });

      expect(lockService.locked).toBe(false);
    });
  });

  describe('onAllExtensionsClosed', () => {
    it('creates auto-lock alarm when wallet is unlocked', async () => {
      await lockService.unlock('password');

      lockService.onAllExtensionsClosed();

      expect(mockChromeAlarms.create).toHaveBeenCalledWith(
        AlarmsEvents.AUTO_LOCK,
        { periodInMinutes: 30 },
      );
    });

    it('does not create alarm when wallet is locked', () => {
      lockService.onAllExtensionsClosed();

      expect(mockChromeAlarms.create).not.toHaveBeenCalled();
    });
  });

  describe('unlock', () => {
    it('activates storage service with password', async () => {
      await lockService.unlock('test-password');

      expect(storageService.activate).toHaveBeenCalledWith('test-password');
    });

    it('sets locked to false on successful unlock', async () => {
      await lockService.unlock('test-password');

      expect(lockService.locked).toBe(false);
    });

    it('calls callbackManager.onUnlock on successful unlock', async () => {
      await lockService.unlock('test-password');

      expect(callbackManager.onUnlock).toHaveBeenCalledTimes(1);
    });

    it('emits LOCK_STATE_CHANGED event with isUnlocked true on successful unlock', async () => {
      const listener = jest.fn();
      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener);

      await lockService.unlock('test-password');

      expect(listener).toHaveBeenCalledWith({ isUnlocked: true });
    });

    it('throws "invalid password" error when storage activation fails', async () => {
      storageService.activate.mockRejectedValue(
        new Error('password incorrect'),
      );

      await expect(lockService.unlock('wrong-password')).rejects.toThrow(
        'invalid password',
      );
    });

    it('remains locked when unlock fails', async () => {
      storageService.activate.mockRejectedValue(
        new Error('password incorrect'),
      );

      try {
        await lockService.unlock('wrong-password');
      } catch {
        // expected to throw
      }

      expect(lockService.locked).toBe(true);
    });

    it('does not call onUnlock when unlock fails', async () => {
      storageService.activate.mockRejectedValue(
        new Error('password incorrect'),
      );

      try {
        await lockService.unlock('wrong-password');
      } catch {
        // expected to throw
      }

      expect(callbackManager.onUnlock).not.toHaveBeenCalled();
    });

    it('does not emit event when unlock fails', async () => {
      storageService.activate.mockRejectedValue(
        new Error('password incorrect'),
      );
      const listener = jest.fn();
      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener);

      try {
        await lockService.unlock('wrong-password');
      } catch {
        // expected to throw
      }

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('delegates to storageService.changePassword', async () => {
      await lockService.changePassword('old-password', 'new-password');

      expect(storageService.changePassword).toHaveBeenCalledWith(
        'old-password',
        'new-password',
      );
    });

    it('propagates errors from storageService', async () => {
      storageService.changePassword.mockRejectedValue(
        new Error('password incorrect'),
      );

      await expect(
        lockService.changePassword('wrong-password', 'new-password'),
      ).rejects.toThrow('password incorrect');
    });
  });

  describe('verifyPassword', () => {
    it('returns true when password is correct', async () => {
      const result = await lockService.verifyPassword('correct-password');

      expect(result).toBe(true);
      expect(storageService.verifyPassword).toHaveBeenCalledWith(
        'correct-password',
      );
    });

    it('returns false when password is incorrect', async () => {
      storageService.verifyPassword.mockResolvedValue(false);

      const result = await lockService.verifyPassword('wrong-password');

      expect(result).toBe(false);
    });
  });

  describe('lock', () => {
    beforeEach(async () => {
      await lockService.unlock('password');
      jest.clearAllMocks();
    });

    it('sets locked to true', () => {
      lockService.lock();

      expect(lockService.locked).toBe(true);
    });

    it('clears session storage', () => {
      lockService.lock();

      expect(storageService.clearSessionStorage).toHaveBeenCalledTimes(1);
    });

    it('calls callbackManager.onLock', () => {
      lockService.lock();

      expect(callbackManager.onLock).toHaveBeenCalledTimes(1);
    });

    it('emits LOCK_STATE_CHANGED event with isUnlocked false', () => {
      const listener = jest.fn();
      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener);

      lockService.lock();

      expect(listener).toHaveBeenCalledWith({ isUnlocked: false });
    });

    it('clears auto-lock alarm', () => {
      lockService.lock();

      expect(mockChromeAlarms.clear).toHaveBeenCalledWith(
        AlarmsEvents.AUTO_LOCK,
      );
    });
  });

  describe('addListener', () => {
    it('adds listener for LOCK_STATE_CHANGED event', async () => {
      const listener = jest.fn();

      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener);
      await lockService.unlock('password');

      expect(listener).toHaveBeenCalledWith({ isUnlocked: true });
    });

    it('supports multiple listeners', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener1);
      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener2);
      await lockService.unlock('password');

      expect(listener1).toHaveBeenCalledWith({ isUnlocked: true });
      expect(listener2).toHaveBeenCalledWith({ isUnlocked: true });
    });
  });

  describe('removeListener', () => {
    it('removes listener for LOCK_STATE_CHANGED event', async () => {
      const listener = jest.fn();

      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener);
      lockService.removeListener(LockEvents.LOCK_STATE_CHANGED, listener);
      await lockService.unlock('password');

      expect(listener).not.toHaveBeenCalled();
    });

    it('only removes the specified listener', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener1);
      lockService.addListener(LockEvents.LOCK_STATE_CHANGED, listener2);
      lockService.removeListener(LockEvents.LOCK_STATE_CHANGED, listener1);
      await lockService.unlock('password');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith({ isUnlocked: true });
    });
  });
});
