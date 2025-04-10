import { EventEmitter } from 'events';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { deleteToken, getToken } from 'firebase/messaging';
import {
  getMessaging,
  MessagePayload,
  onBackgroundMessage,
  isSupported as isSupportedBrowserByFcm,
} from 'firebase/messaging/sw';
import { singleton } from 'tsyringe';
import { FirebaseEvents, FcmMessageListener } from './models';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FeatureFlagEvents, FeatureGates } from '../featureFlags/models';
import { isSupportedBrowser } from '@src/utils/isSupportedBrowser';

@singleton()
export class FirebaseService {
  #app?: FirebaseApp;
  #isFcmInitialized = false;
  #fcmToken?: string;
  #firebaseEventEmitter = new EventEmitter();
  #fcmMessageEventEmitter = new EventEmitter();
  #fcmMessageHandlers: Record<string, (payload: MessagePayload) => void> = {};

  constructor(private featureFlagService: FeatureFlagService) {
    if (!process.env.FIREBASE_CONFIG) {
      throw new Error('FIREBASE_CONFIG is missing');
    }

    if (!isSupportedBrowser() || !isSupportedBrowserByFcm()) {
      return;
    }

    this.#app = initializeApp(
      JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString()),
    );

    onBackgroundMessage(getMessaging(this.#app), (payload) => {
      console.log(payload);
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
          sentryCaptureException(err as Error, SentryExceptionTypes.FIREBASE);
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

  addFcmMessageListener(event: string, listener: FcmMessageListener) {
    if (this.#fcmMessageHandlers[event]) {
      throw new Error(`Message handler for event ${event} already exists`);
    }

    this.#fcmMessageEventEmitter.on(event, listener);
    this.#fcmMessageHandlers[event] = listener;
  }

  async #handleMessage(payload: MessagePayload) {
    const event = payload.data?.event ?? '';

    if (this.#fcmMessageHandlers[event]) {
      this.#fcmMessageEventEmitter.emit(event, payload);
    }
  }
}
