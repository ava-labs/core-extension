import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { CubeSigner } from '@cubist-labs/cubesigner-sdk';
import { filter, firstValueFrom, map, Subject, Subscription } from 'rxjs';

import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { DecodedFIDOResult } from '@src/utils/seedless/fido/types';

import {
  MfaFailureData,
  MfaFidoRequest,
  MfaRequestData,
  MfaResponseData,
  MfaTotpRequest,
  SeedlessEvents,
} from './models';
import { SeedlessTokenStorage } from './SeedlessTokenStorage';
import { SecretsService } from '../secrets/SecretsService';

@singleton()
export class SeedlessMfaService implements OnUnlock, OnLock {
  #eventEmitter = new EventEmitter();
  #storage: SeedlessTokenStorage;

  #request$ = new Subject<MfaRequestData>();
  #response$ = new Subject<MfaResponseData>();
  #subscription?: Subscription;

  constructor(secretsService: SecretsService) {
    this.#storage = new SeedlessTokenStorage(secretsService);
  }

  async #getSession() {
    const session = await CubeSigner.loadSignerSession(this.#storage);

    return session;
  }

  onUnlock() {
    this.#subscription = this.#request$.subscribe((request) => {
      this.#eventEmitter.emit(SeedlessEvents.MfaRequest, request);
    });
  }

  onLock() {
    this.#subscription?.unsubscribe();
  }

  async getRecoveryMethods() {
    const session = await this.#getSession();
    const user = await session.user();

    return user.mfa;
  }

  async requestMfa(mfaRequest: MfaTotpRequest): Promise<string>;
  async requestMfa(mfaRequest: MfaFidoRequest): Promise<DecodedFIDOResult>;
  async requestMfa(
    mfaRequest: MfaRequestData
  ): Promise<string | DecodedFIDOResult> {
    this.#request$.next(mfaRequest);

    // Wait for the user to respond to the MFA challenge
    return firstValueFrom(
      this.#response$.pipe(
        filter((response) => response.mfaId === mfaRequest.mfaId),
        map((response: MfaResponseData) => response.code ?? response.answer)
      )
    );
  }

  async emitMfaError(mfaId: string, tabId?: number) {
    this.#eventEmitter.emit(SeedlessEvents.MfaFailure, { mfaId, tabId });
  }

  async submitMfaResponse(mfaResponse: MfaResponseData) {
    this.#response$.next(mfaResponse);
  }

  addListener(
    event: SeedlessEvents.MfaRequest,
    callback: (data: MfaRequestData) => void
  );
  addListener(
    event: SeedlessEvents.MfaFailure,
    callback: (data: MfaFailureData) => void
  );
  addListener(
    event: SeedlessEvents.MfaFailure | SeedlessEvents.MfaRequest,
    callback: (data) => void
  ) {
    this.#eventEmitter.on(event, callback);
  }
}
