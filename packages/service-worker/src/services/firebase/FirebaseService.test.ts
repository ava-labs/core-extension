import { FirebaseApp, initializeApp } from 'firebase/app';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FirebaseService } from './FirebaseService';
import {
  getMessaging,
  Messaging,
  NextFn,
  onBackgroundMessage,
} from 'firebase/messaging/sw';
import {
  FeatureFlagEvents,
  FeatureFlags,
  FeatureGates,
} from '../featureFlags/models';
import { deleteToken, getToken, MessagePayload } from 'firebase/messaging';
import { FcmMessageEvents, FirebaseEvents } from './models';
import { isSupportedBrowser } from 'packages/utils/src/isSupportedBrowser';

jest.mock('firebase/app');
jest.mock('firebase/messaging');
jest.mock('firebase/messaging/sw');
jest.mock('@src/utils/isSupportedBrowser');

describe('FirebaseService', () => {
  const realEnv = process.env;
  const featureFlagService = {
    addListener: jest.fn(),
  } as unknown as FeatureFlagService;
  const appMock = { name: 'test' } as FirebaseApp;
  const messagingMock = { app: appMock } as Messaging;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(initializeApp).mockReturnValue(appMock);
    jest.mocked(getMessaging).mockReturnValue(messagingMock);
    jest.mocked(isSupportedBrowser).mockReturnValue(true);

    process.env = {
      ...realEnv,
      FIREBASE_CONFIG: Buffer.from(JSON.stringify({ foo: 'bar' })).toString(
        'base64',
      ),
    };
  });

  afterAll(() => {
    process.env = realEnv;
  });

  it('throws when FIREBASE_CONFIG is missing', () => {
    delete process.env.FIREBASE_CONFIG;

    expect(() => new FirebaseService(featureFlagService)).toThrow(
      'FIREBASE_CONFIG is missing',
    );
  });

  it('does not initialize when the browser is not supported', () => {
    jest.mocked(isSupportedBrowser).mockReturnValueOnce(false);

    const firebaseService = new FirebaseService(featureFlagService);
    expect(firebaseService.getFirebaseApp()).toBeUndefined();
    expect(initializeApp).not.toHaveBeenCalled();
  });

  it('initializes correctly', () => {
    const firebaseService = new FirebaseService(featureFlagService);

    expect(firebaseService.getFirebaseApp()).toBe(appMock);
    expect(firebaseService.isFcmInitialized).toBe(false);
    expect(firebaseService.getFcmToken()).toBeUndefined();
    expect(initializeApp).toHaveBeenCalledWith({ foo: 'bar' });
    expect(getMessaging).toHaveBeenCalledWith(appMock);
    expect(onBackgroundMessage).toHaveBeenCalledWith(
      messagingMock,
      expect.any(Function),
    );
    expect(featureFlagService.addListener).toHaveBeenCalledWith(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      expect.any(Function),
    );
  });

  describe('FCM', () => {
    const fcmTokenMock = 'fcmToken';

    beforeEach(() => {
      jest.mocked(getToken).mockResolvedValue(fcmTokenMock);
    });

    it('initializes FCM when the feature is enabled', async () => {
      const initializedEventListener = jest.fn();
      const firebaseService = new FirebaseService(featureFlagService);

      firebaseService.addFirebaseEventListener(
        FirebaseEvents.FCM_INITIALIZED,
        initializedEventListener,
      );

      // simulate FEATURE_FLAG_UPDATED event
      await expect(
        jest.mocked(featureFlagService.addListener).mock.calls[0]?.[1]({
          [FeatureGates.FIREBASE_CLOUD_MESSAGING]: true,
        } as FeatureFlags),
      ).resolves.toBeUndefined();

      expect(firebaseService.isFcmInitialized).toBe(true);
      expect(firebaseService.getFcmToken()).toBe(fcmTokenMock);
      expect(getMessaging).toHaveBeenCalledWith(appMock);
      expect(getToken).toHaveBeenCalledWith(messagingMock, {
        serviceWorkerRegistration: globalThis.registration,
      });
      expect(initializedEventListener).toHaveBeenCalledTimes(1);
    });

    it('terminates FCM when the feature is disabled', async () => {
      const terminatedEventListener = jest.fn();
      const firebaseService = new FirebaseService(featureFlagService);

      firebaseService.addFirebaseEventListener(
        FirebaseEvents.FCM_TERMINATED,
        terminatedEventListener,
      );

      // simulate FEATURE_FLAG_UPDATED event (enabled)
      await expect(
        jest.mocked(featureFlagService.addListener).mock.calls[0]?.[1]({
          [FeatureGates.FIREBASE_CLOUD_MESSAGING]: true,
        } as FeatureFlags),
      ).resolves.toBeUndefined();

      // simulate FEATURE_FLAG_UPDATED event (disabled)
      await expect(
        jest.mocked(featureFlagService.addListener).mock.calls[0]?.[1]({
          [FeatureGates.FIREBASE_CLOUD_MESSAGING]: false,
        } as FeatureFlags),
      ).resolves.toBeUndefined();

      expect(firebaseService.isFcmInitialized).toBe(false);
      expect(firebaseService.getFcmToken()).toBeUndefined();
      expect(getMessaging).toHaveBeenCalledWith(appMock);
      expect(deleteToken).toHaveBeenCalledWith(messagingMock);
      expect(terminatedEventListener).toHaveBeenCalledTimes(1);
    });

    it.each(Object.values(FcmMessageEvents))(
      'emits incoming messages to the listeners correctly',
      async (event) => {
        const messageMock = {
          data: {
            event,
            foo: 'bar',
          },
        } as unknown as MessagePayload;
        const eventListener = jest.fn();
        const firebaseService = new FirebaseService(featureFlagService);

        firebaseService.addFcmMessageListener(event, eventListener);

        // simulate incoming message
        (
          jest.mocked(onBackgroundMessage).mock
            .calls[0]?.[1] as NextFn<MessagePayload>
        )(messageMock);

        expect(eventListener).toHaveBeenCalledTimes(1);
        expect(eventListener).toHaveBeenCalledWith(messageMock);
      },
    );
  });
});
