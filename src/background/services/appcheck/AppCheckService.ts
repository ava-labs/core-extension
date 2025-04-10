import * as Sentry from '@sentry/browser';
import {
  AppCheck,
  CustomProvider,
  getToken,
  initializeAppCheck,
  setTokenAutoRefreshEnabled,
} from 'firebase/app-check';
import { MessagePayload } from 'firebase/messaging/sw';
import { singleton } from 'tsyringe';
import { FirebaseService } from '../firebase/FirebaseService';
import { FirebaseEvents } from '../firebase/models';
import { AppCheckRegistrationChallenge, ChallengeRequest } from './models';
import registerForChallenge from './utils/registerForChallenge';
import verifyChallenge from './utils/verifyChallenge';
import solveChallenge from './utils/solveChallenge';

export const WAIT_FOR_CHALLENGE_ATTEMPT_COUNT = 20;
export const WAIT_FOR_CHALLENGE_DELAY_MS = 500;
export const MESSAGE_EVENT = 'ID_CHALLENGE';

// Implementation based on https://github.com/ava-labs/core-id-service/blob/main/docs/extension-appcheck-attestation.md
@singleton()
export class AppCheckService {
  #appCheck?: AppCheck;
  #lastChallengeRequest?: ChallengeRequest;

  constructor(private firebaseService: FirebaseService) {}

  activate(): void {
    this.firebaseService.addFcmMessageListener(MESSAGE_EVENT, (payload) =>
      this.#handleMessage(payload),
    );

    this.firebaseService.addFirebaseEventListener(
      FirebaseEvents.FCM_INITIALIZED,
      () => this.#startAppcheck(),
    );

    this.firebaseService.addFirebaseEventListener(
      FirebaseEvents.FCM_TERMINATED,
      () => this.#stopAppcheck(),
    );
  }

  async getAppcheckToken(forceRefresh = false) {
    if (!this.firebaseService.isFcmInitialized || !this.#appCheck) {
      return;
    }

    return getToken(this.#appCheck, forceRefresh);
  }

  #startAppcheck() {
    if (this.#appCheck) {
      setTokenAutoRefreshEnabled(this.#appCheck, true);
      return;
    }

    this.#appCheck = initializeAppCheck(this.firebaseService.getFirebaseApp(), {
      provider: new CustomProvider({
        getToken: async () => {
          const sentryTracker = Sentry.startTransaction({
            name: `AppCheckService: getToken`,
          });

          try {
            if (!this.firebaseService.isFcmInitialized) {
              throw new Error('fcm is not initialized');
            }

            const fcmToken = this.firebaseService.getFcmToken();

            if (!fcmToken) {
              throw new Error('fcm token is missing');
            }

            this.#lastChallengeRequest = {
              id: crypto.randomUUID(),
              tracker: sentryTracker,
            };

            const waitForChallenge = () =>
              new Promise<{ registrationId: string; solution: string }>(
                (res, rej) => {
                  let remainingAttempts = WAIT_FOR_CHALLENGE_ATTEMPT_COUNT;

                  const timer = setInterval(() => {
                    const registrationId =
                      this.#lastChallengeRequest?.registrationId;
                    const solution = this.#lastChallengeRequest?.solution;

                    remainingAttempts--;

                    if (registrationId && solution) {
                      clearInterval(timer);
                      res({ registrationId, solution });
                    } else if (remainingAttempts < 1) {
                      clearInterval(timer);
                      rej('[AppCheck] challenge solution timeout');
                    }
                  }, WAIT_FOR_CHALLENGE_DELAY_MS);
                },
              );

            try {
              const registrationSpan = sentryTracker.startChild({
                name: 'registerForChallenge',
              });
              await registerForChallenge({
                token: fcmToken,
                requestId: this.#lastChallengeRequest.id,
              });
              registrationSpan.finish();

              const waitForChallengeSpan = sentryTracker.startChild({
                name: 'waitForChallenge',
              });
              const { registrationId, solution } = await waitForChallenge();
              waitForChallengeSpan.finish();

              const verifyChallengeSpan = sentryTracker.startChild({
                name: 'verifyChallenge',
              });
              const { token, exp: expireTimeMillis } = await verifyChallenge({
                registrationId,
                solution,
              });
              verifyChallengeSpan.finish();

              sentryTracker.setStatus('success');

              return {
                token,
                expireTimeMillis,
              };
            } catch (err) {
              this.#lastChallengeRequest = undefined;
              throw err;
            }
          } catch (err) {
            sentryTracker.setStatus('error');
            throw err;
          } finally {
            sentryTracker.finish();
          }
        },
      }),
      isTokenAutoRefreshEnabled: true,
    });

    this.getAppcheckToken(true);
  }

  #stopAppcheck() {
    if (this.#appCheck) {
      setTokenAutoRefreshEnabled(this.#appCheck, false);
    }
  }

  #handleMessage(payload: MessagePayload) {
    const event = payload.data?.event;

    if (event !== MESSAGE_EVENT) {
      throw new Error(`Unsupported event: "${event}"`);
    }

    return this.#handleIdChallenge(payload);
  }

  async #handleIdChallenge(payload: MessagePayload) {
    const challenge = payload.data as AppCheckRegistrationChallenge;

    if (challenge.requestId !== this.#lastChallengeRequest?.id) {
      return;
    }

    this.#lastChallengeRequest.registrationId = challenge.registrationId;

    const solveChallengeSpan = this.#lastChallengeRequest.tracker.startChild({
      name: 'solveChallenge',
      tags: {
        type: challenge.type,
      },
    });
    this.#lastChallengeRequest.solution = await solveChallenge({
      type: challenge.type,
      challengeDetails: challenge.details,
    });
    solveChallengeSpan.finish();
  }
}
