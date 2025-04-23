import { EventEmitter } from 'events';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { deleteToken, getToken } from 'firebase/messaging';
import {
  getMessaging,
  MessagePayload,
  onBackgroundMessage,
} from 'firebase/messaging/sw';
import { singleton } from 'tsyringe';
import { FcmMessageEvents, FirebaseEvents, FcmMessageListener } from './models';
import { Monitoring } from '@core/common';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FeatureFlagEvents, FeatureGates } from '../featureFlags/models';
import { isSupportedBrowser } from '@core/utils';

@singleton()
export class FirebaseService {
  #app?: FirebaseApp;
  #isFcmInitialized = false;
  #fcmToken?: string;
  #firebaseEventEmitter = new EventEmitter();
  #fcmMessageEventEmitter = new EventEmitter();

  constructor(private featureFlagService: FeatureFlagService) {
    if (!process.env.FIREBASE_CONFIG) {
      throw new Error('FIREBASE_CONFIG is missing');
    }

    if (!isSupportedBrowser()) {
      return;
    }

    this.#app = initializeApp(
      JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString()),
    );

    onBackgroundMessage(getMessaging(this.#app), (payload) => {
      this.#handleMessage(payload);
    });

    this.featureFlagService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      async (featureFlags) => {
        try {
          if (
            this.#isFcmInitialized &&
            !featureFlags[FeatureGates.FIREBASE_CLOUD_MESSAGING]
          ) {
            await deleteToken(getMessaging(this.#app));

            this.#isFcmInitialized = false;
            this.#fcmToken = undefined;
            this.#firebaseEventEmitter.emit(FirebaseEvents.FCM_TERMINATED);
            return;
          }

          if (
            !this.#isFcmInitialized &&
            featureFlags[FeatureGates.FIREBASE_CLOUD_MESSAGING]
          ) {
            this.#fcmToken = await getToken(getMessaging(this.#app), {
              serviceWorkerRegistration: globalThis.registration,
            });

            this.#isFcmInitialized = true;
            this.#firebaseEventEmitter.emit(FirebaseEvents.FCM_INITIALIZED);
            return;
          }
        } catch (err) {
          Monitoring.sentryCaptureException(
            err as Error,
            Monitoring.SentryExceptionTypes.FIREBASE,
          );
        }
      },
    );
  }

  get isFcmInitialized() {
    return this.#isFcmInitialized;
  }

  getFirebaseApp() {
    return this.#app;
  }

  getFcmToken() {
    return this.#fcmToken;
  }

  addFirebaseEventListener<T = unknown>(
    event: FirebaseEvents,
    callback: () => T,
  ) {
    this.#firebaseEventEmitter.on(event, callback);
  }

  addFcmMessageListener(event: FcmMessageEvents, listener: FcmMessageListener) {
    this.#fcmMessageEventEmitter.on(event, listener);
  }

  async #handleMessage(payload: MessagePayload) {
    const event = payload.data?.event ?? '';

    if (Object.values(FcmMessageEvents).includes(event as FcmMessageEvents)) {
      this.#fcmMessageEventEmitter.emit(event, payload);
    }
  }
}
