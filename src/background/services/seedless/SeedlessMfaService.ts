import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { filter, firstValueFrom, map, Subject, Subscription } from 'rxjs';

import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';

import {
  MfaFailureData,
  MfaRequestData,
  MfaResponseData,
  SeedlessEvents,
} from './models';

@singleton()
export class SeedlessMfaService implements OnUnlock, OnLock {
  #eventEmitter = new EventEmitter();

  #request$ = new Subject<MfaRequestData>();
  #response$ = new Subject<MfaResponseData>();
  #subscription?: Subscription;

  onUnlock() {
    this.#subscription = this.#request$.subscribe((request) => {
      this.#eventEmitter.emit(SeedlessEvents.MfaRequest, request);
    });
  }

  onLock() {
    this.#subscription?.unsubscribe();
  }

  public submitSignatureResponse(response: MfaResponseData) {
    this.#response$.next(response);
  }

  async requestMfa({
    mfaId,
    type,
    options,
    tabId,
  }: MfaRequestData): Promise<string> {
    this.#request$.next({
      mfaId,
      type,
      tabId,
      options,
    });

    // Wait for the user to respond to the MFA challenge
    return firstValueFrom(
      this.#response$.pipe(
        filter((response) => response.mfaId === mfaId),
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
