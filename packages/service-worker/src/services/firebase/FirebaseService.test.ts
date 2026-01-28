import { isSupportedBrowser } from '@core/common';
import {
  FeatureFlagEvents,
  FeatureFlags,
  FeatureGates,
  FirebaseEvents,
} from '@core/types';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { deleteToken, getToken, MessagePayload } from 'firebase/messaging';
import {
  getMessaging,
  isSupported as isSupportedBrowserByFcm,
  Messaging,
  NextFn,
  onBackgroundMessage,
} from 'firebase/messaging/sw';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FirebaseService } from './FirebaseService';

jest.mock('firebase/app');
jest.mock('firebase/messaging');
jest.mock('firebase/messaging/sw');
jest.mock('@core/common');

describe('FirebaseService', () => {
  const realEnv = process.env;
  const featureFlagService = {
    addListener: jest.fn(),
  } as unknown as FeatureFlagService;
  const appMock = { name: 'test' } as FirebaseApp;
  const messagingMock = { app: appMock } as Messaging;

  const messageListeners = [
    { type: 'test1', listener: jest.fn() },
    { type: 'test2', listener: jest.fn() },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(initializeApp).mockReturnValue(appMock);
    jest.mocked(getMessaging).mockReturnValue(messagingMock);
    jest.mocked(isSupportedBrowser).mockReturnValue(true);
    jest.mocked(isSupportedBrowserByFcm).mockResolvedValue(true);

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

  it('does not subscribe to FCM when the browser is not supported', async () => {
    jest.mocked(isSupportedBrowser).mockReturnValueOnce(false);

    const firebaseService = new FirebaseService(featureFlagService);
    expect(firebaseService.getFirebaseApp()).toBe(appMock);
    expect(initializeApp).toHaveBeenCalledWith({ foo: 'bar' });

    // Wait for any pending promises
    await Promise.resolve();

    expect(getMessaging).not.toHaveBeenCalled();
    expect(onBackgroundMessage).not.toHaveBeenCalled();
    expect(featureFlagService.addListener).not.toHaveBeenCalled();
  });

  it('does not subscribe to FCM when FCM is not supported by browser', async () => {
    jest.mocked(isSupportedBrowserByFcm).mockResolvedValueOnce(false);

    const firebaseService = new FirebaseService(featureFlagService);
    expect(firebaseService.getFirebaseApp()).toBe(appMock);
    expect(initializeApp).toHaveBeenCalledWith({ foo: 'bar' });

    // Wait for the async isSupportedBrowserByFcm check
    await Promise.resolve();

    expect(getMessaging).not.toHaveBeenCalled();
    expect(onBackgroundMessage).not.toHaveBeenCalled();
    // Feature flag listener should still be registered
    expect(featureFlagService.addListener).toHaveBeenCalledWith(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      expect.any(Function),
    );
  });

  it('initializes correctly', async () => {
    const firebaseService = new FirebaseService(featureFlagService);

    expect(firebaseService.getFirebaseApp()).toBe(appMock);
    expect(firebaseService.isFcmInitialized).toBe(false);
    expect(firebaseService.getFcmToken()).toBeUndefined();
    expect(initializeApp).toHaveBeenCalledWith({ foo: 'bar' });

    // Wait for the async isSupportedBrowserByFcm check
    await Promise.resolve();

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

    it('does not initialize FCM when the browser is not supported', async () => {
      // Mock to return false for all calls (constructor check + feature flag listener check)
      jest.mocked(isSupportedBrowserByFcm).mockResolvedValue(false);

      const initializedEventListener = jest.fn();
      const firebaseService = new FirebaseService(featureFlagService);

      // Wait for the async isSupportedBrowserByFcm check in constructor
      await Promise.resolve();

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

      expect(firebaseService.isFcmInitialized).toBe(false);
      expect(firebaseService.getFcmToken()).toBe(undefined);
      expect(getToken).not.toHaveBeenCalled();
      expect(initializedEventListener).not.toHaveBeenCalled();
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

    it.each(messageListeners)(
      'emits incoming messages to the listeners correctly',
      async ({ type, listener }) => {
        const firebaseService = new FirebaseService(featureFlagService);

        // Wait for the async isSupportedBrowserByFcm check to complete
        await Promise.resolve();

        firebaseService.addFcmMessageListener(type, listener);

        const messageMock = {
          data: {
            type,
            foo: 'bar',
          },
        } as unknown as MessagePayload;

        (
          jest.mocked(onBackgroundMessage).mock
            .calls[0]?.[1] as NextFn<MessagePayload>
        )(messageMock);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(messageMock);
      },
    );
  });
});
