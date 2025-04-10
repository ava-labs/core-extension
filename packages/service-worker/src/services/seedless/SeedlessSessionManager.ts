import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { CubeSigner, SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import { SecretsService } from '../secrets/SecretsService';
import { SeedlessTokenStorage } from './SeedlessTokenStorage';
import { SeedlessEvents } from './models';
import { isTokenExpiredError } from './utils';
import { isFailedToFetchError } from '@src/utils/isFailedToFetchError';
import { Monitoring } from '@avalabs/core-ext-common';

@singleton()
export class SeedlessSessionManager {
  #eventEmitter: EventEmitter;
  #storage: SeedlessTokenStorage;

  hasTokenExpired: boolean | undefined;

  constructor(secretsService: SecretsService) {
    this.#storage = new SeedlessTokenStorage(secretsService);
    this.#eventEmitter = new EventEmitter();
  }

  async updateSignerToken(token: SignerSessionData) {
    await this.#storage.save(token);
    this.notifyTokenRefreshed();
  }

  /**
   * Attempts to automatically refresh the session.
   * Prompts the user to sign-in again if the refresh token has expired.
   */
  async refreshSession() {
    try {
      const session = await CubeSigner.loadSignerSession(this.#storage);

      await session.sessionMgr.refresh();

      this.notifyTokenRefreshed();
    } catch (err) {
      if (isTokenExpiredError(err)) {
        this.notifyTokenExpired();
      } else if (!isFailedToFetchError(err)) {
        // Log unknown errors to Sentry
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.SEEDLESS,
        );
      }
    }
  }

  notifyTokenRefreshed() {
    this.hasTokenExpired = false;
    this.#eventEmitter.emit(SeedlessEvents.TokenRefreshed);
  }

  notifyTokenExpired() {
    this.hasTokenExpired = true;
    this.#eventEmitter.emit(SeedlessEvents.TokenExpired);
  }

  addListener(event: SeedlessEvents, callback: () => void) {
    this.#eventEmitter.on(event, callback);
  }
}
