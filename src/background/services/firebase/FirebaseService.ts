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
  ChatSession,
  EnhancedGenerateContentResponse,
} from 'firebase/vertexai';

@singleton()
export class FirebaseService {
  #app?: FirebaseApp;
  #isFcmInitialized = false;
  #fcmToken?: string;
  #firebaseEventEmitter = new EventEmitter();
  #fcmMessageEventEmitter = new EventEmitter();
  #model?: GenerativeModel;
  #chat?: ChatSession;

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

  #getModel({ tools, toolConfig, systemInstruction }) {
    if (!this.#app) {
      throw new Error('Firebase app has not initialized');
    }
    const vertexAI = getVertexAI(this.#app);
    return getGenerativeModel(vertexAI, {
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.5,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
      tools,
      toolConfig,
      systemInstruction,
    });
  }

  async startChat({ tools, toolConfig, systemInstruction, history }) {
    if (!this.#model) {
      this.#model = this.#getModel({
        tools,
        toolConfig,
        systemInstruction,
      });
    }
    this.#chat = this.#model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
    return true;
  }

  async sendModelMessage(message: string) {
    if (!this.#chat) {
      // this.#chat = this.startChat();
      throw new Error('No chat');
    }
    console.log('message: ', message);

    const result = await this.#chat.sendMessage(message);

    const response = result.response;
    console.log('sendModelMessage response: ', response);
    const text = response.text();
    console.log('text: ', text);
    return response;
    // return text;
  }

  async #handleMessage(payload: MessagePayload) {
    const event = payload.data?.event ?? '';

    if (Object.values(FcmMessageEvents).includes(event as FcmMessageEvents)) {
      this.#fcmMessageEventEmitter.emit(event, payload);
    }
  }
}
