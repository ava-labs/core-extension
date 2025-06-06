import * as Sentry from '@sentry/browser';
import {
  AppCheck,
  CustomProvider,
  initializeAppCheck,
} from 'firebase/app-check';
import { FirebaseService } from '../firebase/FirebaseService';
import { AppCheckService } from './AppCheckService';
import registerForChallenge from './utils/registerForChallenge';
import verifyChallenge from './utils/verifyChallenge';

jest.mock('@sentry/browser');
jest.mock('firebase/app-check');
jest.mock('./utils/registerForChallenge');
jest.mock('./utils/verifyChallenge');

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
    } as unknown as FirebaseService;

    appCheckService = new AppCheckService(firebaseService);
    appCheckService.activate();
  });

  const appCheckMock = { app: { name: 'test' } } as AppCheck;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(initializeAppCheck).mockReturnValue(appCheckMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes appcheck correctly', () => {
    appCheckService.activate();

    expect(initializeAppCheck).toHaveBeenCalledWith(
      { name: 'test' },
      {
        provider: expect.any(CustomProvider),
        isTokenAutoRefreshEnabled: true,
      },
    );
  });

  describe('getToken', () => {
    it('returns undefined when appcheck is not initialized', async () => {
      const token = await appCheckService.getAppcheckToken();
      expect(token).toBeUndefined();
    });

    it('returns a token when appcheck is initialized', async () => {
      jest.mocked(crypto.randomUUID).mockReturnValue('1-2-3-4-5');
      jest.mocked(registerForChallenge).mockResolvedValueOnce({
        challengeId: 'challengeId',
        path: 'path',
        nonce: 'nonce',
      });
      jest.mocked(verifyChallenge).mockResolvedValueOnce({
        token: 'token',
        exp: 1234,
      });

      const token = await jest
        .mocked(CustomProvider)
        .mock.calls[0]?.[0].getToken();

      expect(token).toStrictEqual({ token: 'token', expireTimeMillis: 1234 });
      expect(registerForChallenge).toHaveBeenCalledWith({
        requestId: crypto.randomUUID(),
      });
      expect(verifyChallenge).toHaveBeenCalledWith({
        challengeId: 'challengeId',
        path: 'path',
        nonce: 'nonce',
      });
    });
  });
});
