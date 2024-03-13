import { CubeSigner, SignerSession } from '@cubist-labs/cubesigner-sdk';

import { SecretsService } from '../secrets/SecretsService';

import { SeedlessMfaService } from './SeedlessMfaService';
import { MfaRequestData, MfaRequestType, SeedlessEvents } from './models';

jest.mock('@cubist-labs/cubesigner-sdk');

const tabId = 852;

describe('src/background/services/seedless/SeedlessMfaService.ts', () => {
  const secretsService = jest.mocked<SecretsService>({} as any);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('requestMfa', () => {
    let service: SeedlessMfaService;

    beforeEach(async () => {
      service = new SeedlessMfaService(secretsService);
    });

    describe('when extension is locked', () => {
      beforeEach(() => {
        service.onLock();
      });

      it('does not pass the MFA requests to the UI', () => {
        const eventListener = jest.fn();
        service.addListener(SeedlessEvents.MfaRequest, eventListener);

        const request: MfaRequestData = {
          mfaId: 'abcd-1234',
          type: MfaRequestType.Totp,
          tabId,
        };
        service.requestMfa(request);

        expect(eventListener).not.toHaveBeenCalled();
      });
    });

    describe('when extension is unlocked', () => {
      beforeEach(() => {
        service.onUnlock();
      });

      it('pushes the requests through the event emitter', () => {
        const eventListener = jest.fn();
        service.addListener(SeedlessEvents.MfaRequest, eventListener);

        const mfaId = 'abcd-1234';
        const request: MfaRequestData = {
          mfaId,
          type: MfaRequestType.Totp,
          tabId,
        };

        // Send request
        service.requestMfa(request);

        expect(eventListener).toBeCalledTimes(1);
        expect(eventListener).toBeCalledWith({
          ...request,
          options: undefined,
        });
      });

      it('only handles responses with matching mfaId', (done) => {
        const eventListener = jest.fn();
        service.addListener(SeedlessEvents.MfaRequest, eventListener);

        const mfaId = 'abcd-1234';
        const request: MfaRequestData = {
          mfaId,
          type: MfaRequestType.Totp,
          tabId,
        };

        // Send request
        const promise = service.requestMfa(request);

        // Mock response for a different request
        service.submitMfaResponse({
          mfaId: mfaId + '123',
          code: 'abcdef',
        });

        // Mock response for our request
        service.submitMfaResponse({
          mfaId,
          code: '123456',
        });

        promise.then((result) => {
          expect(result).toEqual('123456');
          done();
        });
      });
    });

    it('emits failure events', () => {
      const eventListener = jest.fn();
      service.addListener(SeedlessEvents.MfaFailure, eventListener);

      service.emitMfaError('1234', 1337);

      expect(eventListener).toHaveBeenCalledWith({
        mfaId: '1234',
        tabId: 1337,
      });
    });
  });

  describe('.getRecoveryMethods()', () => {
    let session: SignerSession;
    let service: SeedlessMfaService;

    beforeEach(async () => {});

    beforeEach(() => {
      service = new SeedlessMfaService(secretsService);

      session = {
        user: jest.fn(),
      } as any;

      jest.mocked(CubeSigner.loadSignerSession).mockResolvedValueOnce(session);
    });

    it('fetches information about configured mfa methods', async () => {
      jest.mocked(session.user).mockResolvedValueOnce({
        mfa: [{ type: 'totp' }],
      } as any);

      expect(await service.getRecoveryMethods()).toEqual([{ type: 'totp' }]);
    });
  });
});
