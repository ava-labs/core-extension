import { EventEmitter } from 'events';
import { OnLock } from '@src/background/runtime/lifecycleCallbacks';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getToken, Unsubscribe } from 'firebase/messaging';
import {
  getMessaging,
  MessagePayload,
  onBackgroundMessage,
} from 'firebase/messaging/sw';
import { singleton } from 'tsyringe';
import { FcmMessageEvents, FirebaseEvents, FcmMessageListener } from './models';

declare const globalThis: ServiceWorkerGlobalScope;

@singleton()
export class FirebaseService implements OnLock {
  #app: FirebaseApp;
  #fcmToken?: string;
  #fcmUnsubscriber: Unsubscribe;
  #firebaseEventEmitter = new EventEmitter();
  #fcmMessageEventEmitter = new EventEmitter();

  constructor() {
    if (!process.env.FIREBASE_CONFIG) {
      throw new Error('FIREBASE_CONFIG is missing');
    }

    this.#app = initializeApp(
      JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString())
    );

    this.#fcmUnsubscriber = onBackgroundMessage(
      getMessaging(this.#app),
      (payload) => {
        this.#handleMessage(payload);
      }
    );

    globalThis.addEventListener('activate', async () => {
      this.#fcmToken = await getToken(getMessaging(this.#app), {
        serviceWorkerRegistration: globalThis.registration,
      });

      this.#firebaseEventEmitter.emit(FirebaseEvents.FCM_READY);
    });
  }

  onLock() {
    this.#fcmUnsubscriber?.();
    this.#firebaseEventEmitter.removeAllListeners();
    this.#fcmMessageEventEmitter.removeAllListeners();
  }

  getFirebaseApp() {
    return this.#app;
  }

  getFcmToken() {
    return this.#fcmToken;
  }

  addFirebaseEventListener<T = unknown>(
    event: FirebaseEvents,
    callback: (data: T) => void
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
