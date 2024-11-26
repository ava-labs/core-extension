import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getToken } from 'firebase/messaging';
import {
  AppCheck,
  CustomProvider,
  initializeAppCheck,
  setTokenAutoRefreshEnabled,
  getToken as getAppCheckToken,
} from 'firebase/app-check';
import {
  getMessaging,
  MessagePayload,
  Unsubscribe,
  onBackgroundMessage,
} from 'firebase/messaging/sw';
import { singleton } from 'tsyringe';

declare const globalThis: ServiceWorkerGlobalScope;

enum Events {
  ID_CHALLENGE = 'id-challenge',
}

enum ChallengeTypes {
  BASIC = 'BASIC',
}

type AppCheckRegistrationChallenge = {
  requestId: string;
  registrationId: string;
  type: ChallengeTypes;
  event: Events.ID_CHALLENGE;
  details: string;
};

@singleton()
export class AppCheckService implements OnUnlock, OnLock {
  #app: FirebaseApp;
  #appCheck: AppCheck | undefined;
  #fcmToken: string | undefined;
  #unsubscribe: Unsubscribe | undefined;
  #lastChallengeRequest:
    | {
        id: string;
        registrationId?: string;
        solution?: string;
      }
    | undefined;

  constructor() {
    if (!process.env.FIREBASE_CONFIG) {
      throw new Error('FIREBASE_CONFIG is missing');
    }

    this.#app = initializeApp(
      JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString())
    );
  }

  async activate(): Promise<void> {
    this.#unsubscribe = onBackgroundMessage(
      getMessaging(this.#app),
      this.#handleMessage.bind(this)
    );

    globalThis.addEventListener('activate', async () => {
      this.#fcmToken = await getToken(getMessaging(this.#app), {
        serviceWorkerRegistration: globalThis.registration,
      });

      this.#appCheck = initializeAppCheck(this.#app, {
        provider: new CustomProvider({
          getToken: async () => {
            let timer: NodeJS.Timer;

            if (!this.#fcmToken) {
              throw new Error('fcm token is missing');
            }

            this.#lastChallengeRequest = { id: crypto.randomUUID() };

            console.log(`generated request ID`, this.#lastChallengeRequest);

            const registerResponse = await fetch(
              'http://localhost:3000/v1/ext/register',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  token: this.#fcmToken,
                  requestId: this.#lastChallengeRequest.id,
                }),
              }
            );

            console.log({ registerResponse });

            if (!registerResponse.ok) {
              this.#lastChallengeRequest = undefined;

              throw new Error(
                `error during appcheck registration: ${registerResponse.statusText}`
              );
            }

            console.log(
              `registered for appcheck token challenge`,
              this.#lastChallengeRequest
            );

            const promise = () =>
              new Promise<undefined>((res, rej) => {
                let attempts = 10;

                timer = setInterval(() => {
                  console.log(`waiting for challenge... attempt: ${attempts}`);
                  attempts--;

                  if (
                    this.#lastChallengeRequest?.registrationId &&
                    this.#lastChallengeRequest.solution
                  ) {
                    console.log(
                      `challenge received: ${JSON.stringify(
                        this.#lastChallengeRequest
                      )}`
                    );
                    res(undefined);
                  } else if (attempts < 1) {
                    rej('timeout');
                  }
                }, 500);
              });

            try {
              await promise().finally(() => clearInterval(timer));

              const appCheckTokenResponse = await fetch(
                'http://localhost:3000/v1/ext/verify',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    registrationId: this.#lastChallengeRequest?.registrationId,
                    solution: this.#lastChallengeRequest?.solution,
                  }),
                }
              );

              if (!appCheckTokenResponse.ok) {
                this.#lastChallengeRequest = undefined;

                throw new Error(
                  `error during appcheck challenge verification: ${registerResponse.statusText}`
                );
              }

              const appCheckToken = await appCheckTokenResponse.json();

              return {
                token: appCheckToken.token,
                expireTimeMillis: appCheckToken.exp,
              };
            } catch (err) {
              console.log(`failed to get token: ${(err as Error).message}`);
              this.#lastChallengeRequest = undefined;
              throw err;
            }
          },
        }),
        isTokenAutoRefreshEnabled: true,
      });
    });
  }

  async onUnlock(): Promise<void> {
    if (!this.#appCheck) {
      return;
    }

    console.log(await getAppCheckToken(this.#appCheck, true));
  }

  onLock(): void {
    this.#unsubscribe?.();
  }

  #handleMessage(payload: MessagePayload) {
    console.log(payload);
    const event = payload.data?.event;

    switch (event) {
      case Events.ID_CHALLENGE:
        return this.#handleIdChallenge(payload);
      default:
        console.log(`unknown event`);
    }
  }

  #handleIdChallenge(payload: MessagePayload) {
    const challenge = payload.data as AppCheckRegistrationChallenge;

    if (challenge.requestId !== this.#lastChallengeRequest?.id) {
      console.log('incorrect request ID');
      return;
    }

    this.#lastChallengeRequest.registrationId = challenge.registrationId;
    this.#lastChallengeRequest.solution = JSON.parse(challenge.details).token;
  }
}
