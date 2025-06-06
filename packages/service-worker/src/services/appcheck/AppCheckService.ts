import * as Sentry from '@sentry/browser';
import {
  AppCheck,
  CustomProvider,
  getToken,
  initializeAppCheck,
  setTokenAutoRefreshEnabled,
} from 'firebase/app-check';
import { singleton } from 'tsyringe';
import { FirebaseService } from '../firebase/FirebaseService';
import registerForChallenge from './utils/registerForChallenge';
import verifyChallenge from './utils/verifyChallenge';

// Implementation based on https://github.com/ava-labs/core-id-service/blob/main/docs/extension-appcheck-attestation.md
// TODO: replace doc link
@singleton()
export class AppCheckService {
  #appCheck?: AppCheck;

  constructor(private firebaseService: FirebaseService) {}

  async getAppcheckToken(forceRefresh = false) {
    if (!this.#appCheck) {
      return;
    }

    return getToken(this.#appCheck, forceRefresh);
  }

  activate() {
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
            const registrationSpan = sentryTracker.startChild({
              name: 'registerForChallenge',
            });
            const challenge = await registerForChallenge({
              requestId: crypto.randomUUID(),
            });
            registrationSpan.finish();

            const verifyChallengeSpan = sentryTracker.startChild({
              name: 'verifyChallenge',
            });
            const { token, exp: expireTimeMillis } =
              await verifyChallenge(challenge);
            verifyChallengeSpan.finish();

            sentryTracker.setStatus('success');

            return {
              token,
              expireTimeMillis,
            };
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
  }
}
