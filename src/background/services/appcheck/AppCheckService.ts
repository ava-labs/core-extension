import { OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import {
  AppCheck,
  CustomProvider,
  initializeAppCheck,
  getToken as getAppCheckToken,
} from 'firebase/app-check';
import { MessagePayload } from 'firebase/messaging/sw';
import { singleton } from 'tsyringe';
import { FirebaseService } from '../firebase/FirebaseService';
import { FcmMessageEvents, FirebaseEvents } from '../firebase/models';
import { AppCheckRegistrationChallenge } from './models';

@singleton()
export class AppCheckService implements OnUnlock {
  #appCheck: AppCheck | undefined;
  #lastChallengeRequest:
    | {
        id: string;
        registrationId?: string;
        solution?: string;
      }
    | undefined;

  constructor(private firebaseService: FirebaseService) {}

  async activate(): Promise<void> {
    this.firebaseService.addFcmMessageListener(
      FcmMessageEvents.ID_CHALLENGE,
      (payload) => this.#handleMessage(payload)
    );

    this.firebaseService.addFirebaseEventListener(
      FirebaseEvents.FCM_READY,
      () => this.#setupAppcheck()
    );
  }

  async onUnlock(): Promise<void> {
    if (!this.#appCheck) {
      return;
    }

    await getAppCheckToken(this.#appCheck, true);
  }

  #setupAppcheck(): void {
    this.#appCheck = initializeAppCheck(this.firebaseService.getFirebaseApp(), {
      provider: new CustomProvider({
        getToken: async () => {
          console.log(`getToken started at ${new Date()}`);
          let timer: NodeJS.Timer;

          if (!this.firebaseService.getFcmToken()) {
            throw new Error('fcm token is missing');
          }

          this.#lastChallengeRequest = { id: crypto.randomUUID() };

          const registerResponse = await fetch(
            'http://localhost:3000/v1/ext/register',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: this.firebaseService.getFcmToken(),
                requestId: this.#lastChallengeRequest.id,
              }),
            }
          );

          if (!registerResponse.ok) {
            this.#lastChallengeRequest = undefined;

            throw new Error(
              `error during appcheck registration: ${registerResponse.statusText}`
            );
          }

          const promise = () =>
            new Promise<undefined>((res, rej) => {
              let attempts = 10;

              timer = setInterval(() => {
                attempts--;

                if (
                  this.#lastChallengeRequest?.registrationId &&
                  this.#lastChallengeRequest.solution
                ) {
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

            console.log(`getToken finished at ${new Date()}`, appCheckToken);

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
  }

  #handleMessage(payload: MessagePayload) {
    const event = payload.data?.event;

    if (event !== FcmMessageEvents.ID_CHALLENGE) {
      throw new Error(`Unsupported event provided: "${event}"`);
    }

    return this.#handleIdChallenge(payload);
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
