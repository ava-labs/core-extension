import type { SignerSession } from '@cubist-labs/cubesigner-sdk';
import { CubeSigner } from '@cubist-labs/cubesigner-sdk';
import { SeedlessSessionManager } from './SeedlessSessionManager';
import { SeedlessEvents } from './models';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

jest.mock('./SeedlessTokenStorage');
jest.mock('@src/monitoring/sentryCaptureException');

describe('src/background/services/seedless/SeedlessSessionManager', () => {
  describe('.refreshSession()', () => {
    describe('when refreshing succeeds', () => {
      let session: jest.Mocked<SignerSession>;

      beforeEach(() => {
        session = {
          sessionMgr: {
            refresh: jest.fn().mockResolvedValue(undefined),
          },
        } as any;
        jest
          .spyOn(CubeSigner, 'loadSignerSession')
          .mockResolvedValueOnce(session);
      });

      it('emits "token refreshed" event', async () => {
        const listener = jest.fn();

        const manager = new SeedlessSessionManager({} as any);

        manager.addListener(SeedlessEvents.TokenRefreshed, listener);

        await manager.refreshSession();

        expect(listener).toHaveBeenCalled();
      });

      it('sets "hasTokenExpired" flag to false', async () => {
        const manager = new SeedlessSessionManager({} as any);

        manager.hasTokenExpired = true;

        await manager.refreshSession();

        expect(manager.hasTokenExpired).toBe(false);
      });
    });

    describe('when refreshing fails because token expired', () => {
      let session: jest.Mocked<SignerSession>;

      beforeEach(() => {
        const error = new Error('Expired');
        // eslint-disable-next-line
        // @ts-expect-error
        error.status = 403; // CubeSigner emits an ordinary Error with additional fields

        session = {
          sessionMgr: {
            refresh: jest.fn().mockRejectedValue(error),
          },
        } as any;
        jest
          .spyOn(CubeSigner, 'loadSignerSession')
          .mockResolvedValueOnce(session);
      });

      it('emits "token expired" event', async () => {
        const listener = jest.fn();

        const manager = new SeedlessSessionManager({} as any);

        manager.addListener(SeedlessEvents.TokenExpired, listener);

        await manager.refreshSession();

        expect(listener).toHaveBeenCalled();
      });

      it('sets "hasTokenExpired" flag to true', async () => {
        const manager = new SeedlessSessionManager({} as any);

        manager.hasTokenExpired = false;

        await manager.refreshSession();

        expect(manager.hasTokenExpired).toBe(true);
      });
    });

    describe('when refreshing fails because of network issues', () => {
      let session: jest.Mocked<SignerSession>;

      beforeEach(() => {
        session = {
          sessionMgr: {
            refresh: jest
              .fn()
              .mockRejectedValue(new TypeError('Failed to fetch')),
          },
        } as any;
        jest
          .spyOn(CubeSigner, 'loadSignerSession')
          .mockResolvedValueOnce(session);
      });

      it('fails quietly', async () => {
        const manager = new SeedlessSessionManager({} as any);

        await expect(manager.refreshSession()).resolves.not.toThrow();
      });

      it('emits no events', async () => {
        const listener = jest.fn();

        const manager = new SeedlessSessionManager({} as any);

        manager.addListener(SeedlessEvents.TokenExpired, listener);
        manager.addListener(SeedlessEvents.TokenRefreshed, listener);

        await manager.refreshSession();

        expect(listener).not.toHaveBeenCalled();
      });
    });

    describe('when refreshing fails because of unknown issues', () => {
      let session: jest.Mocked<SignerSession>;
      const error = new Error('bla bla');

      beforeEach(() => {
        session = {
          sessionMgr: {
            refresh: jest.fn().mockRejectedValue(error),
          },
        } as any;
        jest
          .spyOn(CubeSigner, 'loadSignerSession')
          .mockResolvedValueOnce(session);
      });

      it('reports error to Sentry', async () => {
        const manager = new SeedlessSessionManager({} as any);

        await manager.refreshSession();

        expect(sentryCaptureException).toHaveBeenCalledWith(
          error,
          SentryExceptionTypes.SEEDLESS,
        );
      });
    });
  });
});
