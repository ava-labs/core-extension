import { EventEmitter } from 'events';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { deleteToken, getToken } from 'firebase/messaging';
import {
  getMessaging,
  MessagePayload,
  onBackgroundMessage,
} from 'firebase/messaging/sw';
import { singleton } from 'tsyringe';
import {
  FcmMessageEvents,
  FirebaseEvents,
  FcmMessageListener,
  ChatConfig,
  ConfigParams,
} from './models';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FeatureFlagEvents, FeatureGates } from '../featureFlags/models';
import { isSupportedBrowser } from '@src/utils/isSupportedBrowser';
import {
  getVertexAI,
  getGenerativeModel,
  GenerativeModel,
  Content,
} from 'firebase/vertexai';

@singleton()
export class FirebaseService {
  #app?: FirebaseApp;
  #isFcmInitialized = false;
  #fcmToken?: string;
  #firebaseEventEmitter = new EventEmitter();
  #fcmMessageEventEmitter = new EventEmitter();
  #model?: GenerativeModel;
  #config?: ChatConfig;

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

  addFcmMessageListener(event: FcmMessageEvents, listener: FcmMessageListener) {
    this.#fcmMessageEventEmitter.on(event, listener);
  }

  #getModel({ tools, toolConfig, systemInstruction }: ConfigParams) {
    if (!this.#app) {
      throw new Error('Firebase app has not initialized');
    }
    const vertexAI = getVertexAI(this.#app);
    const generationConfig = {
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };
    this.#config = {
      generationConfig,
      tools,
      toolConfig,
      systemInstruction,
    };

    return getGenerativeModel(vertexAI, {
      model: 'gemini-2.0-flash',
      generationConfig,
      tools,
      toolConfig,
      systemInstruction,
    });
  }

  async generateContent(message: string, parts?: Content[]) {
    const contents = parts
      ? ([{ role: 'user', parts: [{ text: message }] }, ...parts] as Content[])
      : ([{ role: 'user', parts: [{ text: message }] }] as Content[]);
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

  async startChat({ tools, toolConfig, systemInstruction }: ConfigParams) {
    if (!this.#model) {
      this.#model = this.#getModel({
        tools,
        toolConfig,
        systemInstruction,
      });
    }
    return true;
  }

  async #handleMessage(payload: MessagePayload) {
    const event = payload.data?.event ?? '';

    if (Object.values(FcmMessageEvents).includes(event as FcmMessageEvents)) {
      this.#fcmMessageEventEmitter.emit(event, payload);
    }
  }
}
