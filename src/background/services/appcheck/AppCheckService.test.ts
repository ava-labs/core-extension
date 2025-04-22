import * as Sentry from '@sentry/browser';
import {
  AppCheck,
  CustomProvider,
  initializeAppCheck,
  setTokenAutoRefreshEnabled,
} from 'firebase/app-check';
import { FirebaseService } from '../firebase/FirebaseService';
import { FirebaseEvents } from '../firebase/models';
import {
  AppCheckService,
  MESSAGE_EVENT,
  WAIT_FOR_CHALLENGE_ATTEMPT_COUNT,
  WAIT_FOR_CHALLENGE_DELAY_MS,
} from './AppCheckService';
import registerForChallenge from './utils/registerForChallenge';
import { ChallengeTypes } from './models';
import { MessagePayload } from 'firebase/messaging/sw';
import solveChallenge from './utils/solveChallenge';
import verifyChallenge from './utils/verifyChallenge';

jest.mock('@sentry/browser');
jest.mock('firebase/app-check');
jest.mock('./utils/registerForChallenge');
jest.mock('./utils/verifyChallenge');
jest.mock('./utils/solveChallenge');

describe('AppCheckService', () => {
  let appCheckService: AppCheckService;
  let firebaseService: FirebaseService;

  beforeEach(() => {
    jest.resetAllMocks();

    (Sentry.startTransaction as jest.Mock).mockReturnValue({
      finish: jest.fn(),
      setStatus: jest.fn(),
      startChild: jest.fn(() => ({
        finish: jest.fn(),
      })),
    });

    firebaseService = {
      isFcmInitialized: true,
      getFirebaseApp: () => ({ name: 'test' }),
      getFcmToken: jest.fn().mockReturnValue('fcmToken'),
      addFcmMessageListener: jest.fn(),
      addFirebaseEventListener: jest.fn(),
    } as unknown as FirebaseService;

    appCheckService = new AppCheckService(firebaseService);
    appCheckService.activate();
  });

  it('subscribes for events on activation correctly', () => {
    expect(firebaseService.addFcmMessageListener).toHaveBeenCalledWith(
      MESSAGE_EVENT,
      expect.any(Function),
    );

    expect(firebaseService.addFirebaseEventListener).toHaveBeenCalledTimes(2);
    expect(firebaseService.addFirebaseEventListener).toHaveBeenNthCalledWith(
      1,
      FirebaseEvents.FCM_INITIALIZED,
      expect.any(Function),
    );
    expect(firebaseService.addFirebaseEventListener).toHaveBeenNthCalledWith(
      2,
      FirebaseEvents.FCM_TERMINATED,
      expect.any(Function),
    );
  });

  const appCheckMock = { app: { name: 'test' } } as AppCheck;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(initializeAppCheck).mockReturnValue(appCheckMock);

    // simulate FCM_INITIALIZED event
    jest.mocked(firebaseService.addFirebaseEventListener).mock.calls[0]?.[1]();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes appcheck correctly', () => {
    expect(setTokenAutoRefreshEnabled).not.toHaveBeenCalled();
    expect(initializeAppCheck).toHaveBeenCalledWith(
      { name: 'test' },
      {
        provider: expect.any(CustomProvider),
        isTokenAutoRefreshEnabled: true,
      },
    );

    // simulate FCM_INITIALIZED event (second time)
    jest.mocked(firebaseService.addFirebaseEventListener).mock.calls[0]?.[1]();

    expect(initializeAppCheck).toHaveBeenCalledTimes(1);
    expect(setTokenAutoRefreshEnabled).toHaveBeenCalledWith(appCheckMock, true);
  });

  it('terminates appcheck correctly', () => {
    expect(setTokenAutoRefreshEnabled).not.toHaveBeenCalled();
    expect(initializeAppCheck).toHaveBeenCalledWith(
      { name: 'test' },
      {
        provider: expect.any(CustomProvider),
        isTokenAutoRefreshEnabled: true,
      },
    );

    // simulate FCM_TERMINATED event
    jest.mocked(firebaseService.addFirebaseEventListener).mock.calls[1]?.[1]();

    expect(setTokenAutoRefreshEnabled).toHaveBeenCalledWith(
      appCheckMock,
      false,
    );
  });

  describe('getToken', () => {
    it('throws when FCM is not initialized', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      firebaseService.isFcmInitialized = false;
      await expect(
        jest.mocked(CustomProvider).mock.calls[0]?.[0].getToken(),
      ).rejects.toThrow('fcm is not initialized');
    });

    it('throws when FCM token is missing', async () => {
      jest.mocked(firebaseService.getFcmToken).mockReturnValueOnce(undefined);
      await expect(
        jest.mocked(CustomProvider).mock.calls[0]?.[0].getToken(),
      ).rejects.toThrow('fcm token is missing');
    });

    it('throws a timeout error when challenge is not received in time', async () => {
      jest
        .mocked(CustomProvider)
        .mock.calls[0]?.[0].getToken()
        .catch((err) => {
          expect(err).toBe('[AppCheck] challenge solution timeout');
        });

      for (let i = 0; i <= WAIT_FOR_CHALLENGE_ATTEMPT_COUNT; i++) {
        jest.advanceTimersByTime(WAIT_FOR_CHALLENGE_DELAY_MS);
        await Promise.resolve();
      }
    });

    it('generates a token correctly', async () => {
      jest.mocked(crypto.randomUUID).mockReturnValue('1-2-3-4-5');
      jest.mocked(solveChallenge).mockResolvedValueOnce('solution');
      jest
        .mocked(verifyChallenge)
        .mockResolvedValueOnce({ token: 'token', exp: 1234 });

      const promise = jest.mocked(CustomProvider).mock.calls[0]?.[0].getToken();

      // trigger ID_CHALLENGE event
      jest.mocked(firebaseService.addFcmMessageListener).mock.calls[0]?.[1]({
        data: {
          requestId: crypto.randomUUID(),
          registrationId: 'registrationId',
          type: ChallengeTypes.BASIC,
          event: MESSAGE_EVENT,
          details: '{}',
        },
      } as unknown as MessagePayload);

      await Promise.resolve();
      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      await expect(promise).resolves.toStrictEqual({
        token: 'token',
        expireTimeMillis: 1234,
      });

      expect(registerForChallenge).toHaveBeenCalledWith({
        token: 'fcmToken',
        requestId: crypto.randomUUID(),
      });
      expect(solveChallenge).toHaveBeenCalledWith({
        type: ChallengeTypes.BASIC,
        challengeDetails: '{}',
      });
      expect(verifyChallenge).toHaveBeenCalledWith({
        registrationId: 'registrationId',
        solution: 'solution',
      });
    });
  });
});
