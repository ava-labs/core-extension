import {
  AppCheck,
  CustomProvider,
  getToken,
  initializeAppCheck,
} from 'firebase/app-check';
import { MessagePayload } from 'firebase/messaging/sw';
import { singleton } from 'tsyringe';
import { FirebaseService } from '../firebase/FirebaseService';
import { FcmMessageEvents, FirebaseEvents } from '../firebase/models';
import { AppCheckRegistrationChallenge, ChallengeRequest } from './models';
import registerForChallenge from './utils/registerForChallenge';
import verifyChallenge from './utils/verifyChallenge';

const WAIT_FOR_CHALLENGE_ATTEMPT_COUNT = 10;
const WAIT_FOR_CHALLENGE_DELAY_MS = 500;

@singleton()
export class AppCheckService {
  #appCheck?: AppCheck;
  #lastChallengeRequest?: ChallengeRequest;

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

  async getAppcheckToken(forceRefresh = false) {
    if (!this.#appCheck) {
      return;
    }

    return getToken(this.#appCheck, forceRefresh);
  }

  #setupAppcheck() {
    this.#appCheck = initializeAppCheck(this.firebaseService.getFirebaseApp(), {
      provider: new CustomProvider({
        getToken: async () => {
          const fcmToken = this.firebaseService.getFcmToken();

          if (!fcmToken) {
            throw new Error('fcm token is missing');
          }

          this.#lastChallengeRequest = { id: crypto.randomUUID() };

          const waitForChallenge = () =>
            new Promise<{ registrationId: string; solution: string }>(
              (res, rej) => {
                let attempts = WAIT_FOR_CHALLENGE_ATTEMPT_COUNT;

                const timer = setInterval(() => {
                  const registrationId =
                    this.#lastChallengeRequest?.registrationId;
                  const solution = this.#lastChallengeRequest?.solution;

                  attempts--;

                  if (registrationId && solution) {
                    clearInterval(timer);
                    res({ registrationId, solution });
                  } else if (attempts < 1) {
                    clearInterval(timer);
                    rej('timeout');
                  }
                }, WAIT_FOR_CHALLENGE_DELAY_MS);
              }
            );

          try {
            await registerForChallenge({
              token: fcmToken,
              requestId: this.#lastChallengeRequest.id,
            });

            const { registrationId, solution } = await waitForChallenge();
            const { token, exp: expireTimeMillis } = await verifyChallenge({
              registrationId,
              solution,
            });

            return {
              token,
              expireTimeMillis,
            };
          } catch (err) {
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
      throw new Error(`Unsupported event: "${event}"`);
    }

    return this.#handleIdChallenge(payload);
  }

  #handleIdChallenge(payload: MessagePayload) {
    const challenge = payload.data as AppCheckRegistrationChallenge;

    if (challenge.requestId !== this.#lastChallengeRequest?.id) {
      return;
    }

    this.#lastChallengeRequest.registrationId = challenge.registrationId;
    this.#lastChallengeRequest.solution = JSON.parse(challenge.details).token;
  }
}
