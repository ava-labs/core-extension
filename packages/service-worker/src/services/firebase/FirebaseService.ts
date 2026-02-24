import { isSupportedBrowser, Monitoring } from '@core/common';
import {
  ChatConfig,
  ChatDialogHistory,
  ConfigParams,
  FcmMessageListener,
  FeatureFlagEvents,
  FeatureGates,
  FirebaseEvents,
} from '@core/types';
import { EventEmitter } from 'events';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { deleteToken, getToken } from 'firebase/messaging';
import {
  getMessaging,
  isSupported as isSupportedBrowserByFcm,
  MessagePayload,
  onBackgroundMessage,
} from 'firebase/messaging/sw';
import {
  getVertexAI,
  getGenerativeModel,
  GenerativeModel,
  Content,
} from 'firebase/vertexai';
import { singleton } from 'tsyringe';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';

@singleton()
export class FirebaseService {
  #app?: FirebaseApp;
  #isFcmInitialized = false;
  #fcmToken?: string;
  #firebaseEventEmitter = new EventEmitter();
  #fcmMessageEventEmitter = new EventEmitter();
  #model?: GenerativeModel;
  #config?: ChatConfig;
  #fcmMessageHandlers: Record<string, (payload: MessagePayload) => void> = {};

  #generationConfig = {
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  };

  constructor(private featureFlagService: FeatureFlagService) {
    if (!process.env.FIREBASE_CONFIG) {
      throw new Error('FIREBASE_CONFIG is missing');
    }

    this.#app = initializeApp(
      JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString()),
    );

    if (!isSupportedBrowser()) {
      return;
    }

    // Initialize background message listener only if FCM is supported
    // This prevents IndexedDB errors in Safari iFrames, Firefox Private Browsing, etc.
    isSupportedBrowserByFcm()
      .then((isSupported) => {
        if (isSupported && this.#app) {
          onBackgroundMessage(getMessaging(this.#app), (payload) => {
            this.#handleMessage(payload);
          });
        }
      })
      .catch((err) => {
        Monitoring.sentryCaptureException(
          err instanceof Error ? err : new Error(String(err)),
          Monitoring.SentryExceptionTypes.FIREBASE,
        );
      });

    this.featureFlagService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      async (featureFlags) => {
        const isSupported = await isSupportedBrowserByFcm();

        if (!isSupported) {
          return;
        }

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

  addFcmMessageListener(type: string, listener: FcmMessageListener) {
    if (this.#fcmMessageHandlers[type]) {
      throw new Error(`Message handler for type ${type} already exists`);
    }

    this.#fcmMessageEventEmitter.on(type, listener);
    this.#fcmMessageHandlers[type] = listener;
  }

  #getModel({ tools, systemInstruction }: ConfigParams) {
    if (!this.#app) {
      throw new Error('Firebase app has not initialized');
    }
    const vertexAI = getVertexAI(this.#app);
    this.#config = {
      generationConfig: this.#generationConfig,
      tools,
      systemInstruction,
    };

    return getGenerativeModel(vertexAI, {
      model: 'gemini-2.5-flash',
      generationConfig: this.#generationConfig,
      tools,
      systemInstruction,
    });
  }

  #updateConfig(config: ConfigParams) {
    this.#config = {
      ...this.#config,
      ...config,
      generationConfig: this.#generationConfig,
    };
  }

  async generateContent({
    message,
    parts,
    history,
    config,
  }: {
    message: string;
    parts?: Content[];
    history?: ChatDialogHistory[];
    config?: ConfigParams;
  }) {
    if (config) {
      this.#updateConfig(config);
    }
    const chatHistory = history
      ? history.map((messageItem) => {
          return {
            role: messageItem.role,
            parts: [{ text: messageItem.content }],
          };
        })
      : [];
    const contents = parts
      ? ([
          ...chatHistory,
          { role: 'user', parts: [{ text: message }] },
          ...parts,
        ] as Content[])
      : ([
          ...chatHistory,
          { role: 'user', parts: [{ text: message }] },
        ] as Content[]);
    const result = await this.#model?.generateContent({
      ...this.#config,
      contents,
    });
    if (!result) {
      throw new Error('no result');
    }
    const response = result.response;
    return response;
  }

  async setModel({ tools, systemInstruction }: ConfigParams) {
    this.#model = this.#getModel({
      tools,
      systemInstruction,
    });

    return true;
  }

  async #handleMessage(payload: MessagePayload) {
    const type = payload.data?.type ?? '';

    if (this.#fcmMessageHandlers[type]) {
      this.#fcmMessageEventEmitter.emit(type, payload);
    }
  }
}
