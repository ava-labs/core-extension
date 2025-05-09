import { SignerSession } from '@cubist-labs/cubesigner-sdk';

import { SecretsService } from '../secrets/SecretsService';

import { SeedlessMfaService } from './SeedlessMfaService';
import {
  MfaRequestData,
  MfaRequestType,
  SeedlessEvents,
  KeyType,
} from '@core/types';

jest.mock('@cubist-labs/cubesigner-sdk');

const tabId = 852;

describe('src/background/services/seedless/SeedlessMfaService.ts', () => {
  const secretsService = jest.mocked<SecretsService>({} as any);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('.requestMfa()', () => {
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

  describe('.approveWithMfa()', () => {
    let service: SeedlessMfaService;

    beforeEach(async () => {
      service = new SeedlessMfaService(secretsService);
    });

    it('retries if MFA verification fails', async () => {
      const badCode = '133731';
      const wrongCodeError = new Error('Invalid TOTP code');
      (wrongCodeError as any).status = 403;

      const originalRequest = {
        mfaId() {
          return 'abcd';
        },
        data() {
          return { x: 'y' };
        },
        approveTotp: jest
          .fn()
          .mockRejectedValueOnce(wrongCodeError)
          .mockResolvedValueOnce({ x: 'y' }),
      } as any;

      // Mock user providing bad code at first
      jest.spyOn(service, 'requestMfa').mockResolvedValueOnce(badCode as any);
      jest.spyOn(service, 'emitMfaError');
      // Mock Cubist "wrong totp code" response:
      jest
        .mocked(originalRequest.approveTotp)
        .mockRejectedValueOnce(wrongCodeError);

      service.approveWithMfa(MfaRequestType.Totp, originalRequest, 123);

      await new Promise(process.nextTick);

      expect(service.requestMfa).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          mfaId: 'abcd',
          type: MfaRequestType.Totp,
          tabId: 123,
        }),
      );

      expect(service.emitMfaError).toHaveBeenCalledWith('abcd', 123);
      expect(service.requestMfa).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          mfaId: 'abcd',
          type: MfaRequestType.Totp,
          tabId: 123,
        }),
      );
    });
  });

  describe('.getRecoveryMethods()', () => {
    let session: SignerSession;
    let service: SeedlessMfaService;

    beforeEach(() => {
      service = new SeedlessMfaService(secretsService);

      session = {
        user: jest.fn(),
      } as any;

      jest
        .mocked(SignerSession.loadSignerSession)
        .mockResolvedValueOnce(session);
    });

    it('fetches information about configured mfa methods', async () => {
      jest.mocked(session.user).mockResolvedValueOnce({
        mfa: [{ type: 'totp' }],
      } as any);

      expect(await service.getRecoveryMethods()).toEqual([{ type: 'totp' }]);
    });
  });

  describe('.initAuthenticatorChange()', () => {
    let session: jest.Mocked<SignerSession>;
    let service: SeedlessMfaService;

    beforeEach(() => {
      service = new SeedlessMfaService(secretsService);

      session = {
        resetTotpStart: jest.fn(),
        user: jest.fn().mockResolvedValue({ mfa: [{ type: 'totp' }] }),
      } as any;
    });

    describe('for non-seedless wallets', () => {
      beforeEach(() => {
        jest
          .mocked(SignerSession.loadSignerSession)
          .mockRejectedValueOnce(new Error('Invalid session data'));
      });

      it('fails', async () => {
        await expect(service.initAuthenticatorChange()).rejects.toThrow(
          'Invalid session data',
        );
      });
    });

    it('initiates TOTP reset', async () => {
      jest
        .mocked(SignerSession.loadSignerSession)
        .mockResolvedValueOnce(session);

      try {
        await service.initAuthenticatorChange();
      } catch {
        expect(session.resetTotpStart).toHaveBeenCalledWith('Core');
      }
    });

    it('performs MFA verification and returns the TOTP challenge', async () => {
      const totpChallenge = {
        requiresMfa() {
          return true;
        },
        mfaId() {
          return 'mfaId';
        },
        approveTotp: jest.fn().mockResolvedValueOnce({
          data() {
            return {
              totpId: 'totpId',
              totpUrl: 'totpUrl',
            };
          },
        }),
      } as any;

      session.resetTotpStart.mockResolvedValue(totpChallenge);
      jest.mocked(SignerSession.loadSignerSession).mockResolvedValue(session);
      jest.spyOn(service, 'requestMfa').mockResolvedValue('123456' as any);

      const result = await service.initAuthenticatorChange();
      expect(totpChallenge.approveTotp).toHaveBeenCalledWith(session, '123456');
      expect(result).toEqual({
        totpId: 'totpId',
        totpUrl: 'totpUrl',
      });
    });
  });

  describe('.completeAuthenticatorChange()', () => {
    let session: jest.Mocked<SignerSession>;
    let service: SeedlessMfaService;

    beforeEach(() => {
      service = new SeedlessMfaService(secretsService);

      session = {
        resetTotpComplete: jest.fn(),
        user: jest.fn().mockResolvedValue({ mfa: [{ type: 'totp' }] }),
      } as any;
    });

    describe('for non-seedless wallets', () => {
      beforeEach(() => {
        jest
          .mocked(SignerSession.loadSignerSession)
          .mockRejectedValueOnce(new Error('Invalid session data'));
      });

      it('fails', async () => {
        await expect(
          service.completeAuthenticatorChange('totpId', '123456'),
        ).rejects.toThrow('Invalid session data');
      });
    });

    it('completes the TOTP reset', async () => {
      jest.mocked(SignerSession.loadSignerSession).mockResolvedValue(session);

      await service.completeAuthenticatorChange('totpId', '123456');

      expect(session.resetTotpComplete).toHaveBeenCalledWith(
        'totpId',
        '123456',
      );
    });

    it('emits the updated recovery methods', async () => {
      jest.mocked(SignerSession.loadSignerSession).mockResolvedValue(session);

      const mfaMethods = [
        { type: 'totp' },
        { type: 'fido', id: 'id', name: 'name' },
      ];
      session.user.mockResolvedValue({
        mfa: mfaMethods,
      } as any);

      const listener = jest.fn();

      service.addListener(SeedlessEvents.MfaMethodsUpdated, listener);
      await service.completeAuthenticatorChange('totpId', '123456');

      expect(listener).toHaveBeenCalledWith(mfaMethods);
    });
  });

  describe('.addFidoDevice()', () => {
    let session: jest.Mocked<SignerSession>;
    let service: SeedlessMfaService;

    beforeEach(() => {
      service = new SeedlessMfaService(secretsService);

      session = {
        addFidoStart: jest.fn(),
        user: jest.fn().mockResolvedValue({ mfa: [{ type: 'totp' }] }),
      } as any;
    });

    it('initiates FIDO setup flow', async () => {
      jest
        .mocked(SignerSession.loadSignerSession)
        .mockResolvedValueOnce(session);

      try {
        await service.addFidoDevice('yubi', KeyType.Yubikey);
      } catch {
        expect(session.addFidoStart).toHaveBeenCalledWith('yubi');
      }
    });

    it('performs MFA verification if required', async () => {
      session.addFidoStart.mockResolvedValue({
        requiresMfa() {
          return true;
        },
        mfaId() {
          return 'mfa-id';
        },
        approveTotp: () => ({
          data: () => ({
            answer: jest.fn(),
          }),
        }),
      } as any);
      jest.mocked(SignerSession.loadSignerSession).mockResolvedValue(session);
      jest.spyOn(service, 'requestMfa').mockResolvedValue('123456' as any);

      await service.addFidoDevice('yubi', KeyType.Yubikey, 123);

      expect(service.requestMfa).toHaveBeenCalledWith({
        mfaId: 'mfa-id',
        type: MfaRequestType.Totp,
        tabId: 123,
      });
    });

    it('initiates a FIDO challenge for the new device', async () => {
      const fidoChallenge = {
        challengeId: 'challenge-id',
        options: { a: 'b' },
        answer: jest.fn(),
      };
      const fidoAnswer = { c: 'd' };

      session.addFidoStart.mockResolvedValue({
        requiresMfa() {
          return false;
        },
        data() {
          return fidoChallenge;
        },
      } as any);
      jest.mocked(SignerSession.loadSignerSession).mockResolvedValue(session);
      jest
        .spyOn(service, 'requestMfa')
        .mockResolvedValueOnce(fidoAnswer as any);

      await service.addFidoDevice('yubi', KeyType.Yubikey, 123);

      expect(service.requestMfa).toHaveBeenCalledWith({
        mfaId: fidoChallenge.challengeId,
        type: MfaRequestType.FidoRegister,
        keyType: KeyType.Yubikey,
        options: fidoChallenge.options,
        tabId: 123,
      });
      expect(fidoChallenge.answer).toHaveBeenCalledWith(fidoAnswer);
    });
  });

  describe('.removeFidoDevice()', () => {
    let session: jest.Mocked<SignerSession>;
    let service: SeedlessMfaService;

    beforeEach(() => {
      service = new SeedlessMfaService(secretsService);

      session = {
        deleteFido: jest.fn(),
        user: jest.fn().mockResolvedValue({ mfa: [{ type: 'totp' }] }),
      } as any;
    });

    it('initiates FIDO removal', async () => {
      jest
        .mocked(SignerSession.loadSignerSession)
        .mockResolvedValueOnce(session);

      try {
        await service.removeFidoDevice('abcd-1234', 1234);
      } catch {
        expect(session.deleteFido).toHaveBeenCalledWith('abcd-1234');
      }
    });

    it('performs MFA verification if required', async () => {
      session.deleteFido.mockResolvedValue({
        requiresMfa() {
          return true;
        },
        mfaId() {
          return 'mfa-id';
        },
        approveTotp: jest.fn(),
      } as any);
      jest.mocked(SignerSession.loadSignerSession).mockResolvedValue(session);
      jest.spyOn(service, 'requestMfa').mockResolvedValue('123456' as any);

      await service.removeFidoDevice('yubi-1234', 123);

      expect(service.requestMfa).toHaveBeenCalledWith({
        mfaId: 'mfa-id',
        type: MfaRequestType.Totp,
        tabId: 123,
      });
    });
  });

  describe('.removeTotp()', () => {
    let session: jest.Mocked<SignerSession>;
    let service: SeedlessMfaService;

    beforeEach(() => {
      service = new SeedlessMfaService(secretsService);

      session = {
        deleteTotp: jest.fn(),
        fidoApproveStart: jest.fn(),
        user: jest.fn().mockResolvedValue({
          mfa: [{ type: 'fido', id: 'yubi-1234', name: 'yubi' }],
        }),
      } as any;
    });

    it('initiates TOTP removal', async () => {
      jest
        .mocked(SignerSession.loadSignerSession)
        .mockResolvedValueOnce(session);

      try {
        await service.removeTotp(1234);
      } catch {
        expect(session.deleteTotp).toHaveBeenCalled();
      }
    });

    it('performs MFA verification if required', async () => {
      const fidoAnswer = {
        receipt: {
          confirmation: '1234',
        },
      };
      const fidoChallenge = {
        challengeId: 'challenge-id',
        options: { a: 'b' },
        answer: jest.fn().mockResolvedValueOnce(fidoAnswer),
      };
      const signWithMfaApproval = jest.fn();
      session.fidoApproveStart.mockResolvedValue(fidoChallenge as any);
      session.deleteTotp.mockResolvedValue({
        requiresMfa() {
          return true;
        },
        mfaId() {
          return 'mfa-id';
        },
        approveTotp: () => ({
          data: () => ({
            answer: jest.fn(),
          }),
        }),
        signWithMfaApproval,
      } as any);
      jest.mocked(SignerSession.loadSignerSession).mockResolvedValue(session);
      jest.spyOn(service, 'requestMfa').mockResolvedValue('123456' as any);

      await service.removeTotp(123);

      expect(service.requestMfa).toHaveBeenCalledWith({
        mfaId: 'mfa-id',
        type: MfaRequestType.Fido,
        options: fidoChallenge.options,
        tabId: 123,
      });
      expect(signWithMfaApproval).toHaveBeenCalledWith(
        expect.objectContaining({
          mfaId: 'mfa-id',
          mfaConf: fidoAnswer.receipt.confirmation,
        }),
      );
    });
  });
});
