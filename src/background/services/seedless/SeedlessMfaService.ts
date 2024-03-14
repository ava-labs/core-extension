import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { CubeSigner, CubeSignerResponse } from '@cubist-labs/cubesigner-sdk';
import { filter, firstValueFrom, map, Subject, Subscription } from 'rxjs';

import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { DecodedFIDOResult } from '@src/utils/seedless/fido/types';

import {
  AuthErrorCode,
  MfaChoiceRequest,
  MfaChoiceResponse,
  MfaFailureData,
  MfaFidoRequest,
  MfaRequestData,
  MfaRequestType,
  MfaResponseData,
  MfaTotpRequest,
  RecoveryMethod,
  SeedlessEvents,
  TOTP_ISSUER,
  TotpResetChallenge,
} from './models';
import { SeedlessTokenStorage } from './SeedlessTokenStorage';
import { SecretsService } from '../secrets/SecretsService';
import { isFailedMfaError } from './utils';

@singleton()
export class SeedlessMfaService implements OnUnlock, OnLock {
  #eventEmitter = new EventEmitter();
  #storage: SeedlessTokenStorage;

  #challengeRequest$ = new Subject<MfaRequestData>();
  #challengeResponse$ = new Subject<MfaResponseData>();

  #choiceRequest$ = new Subject<MfaChoiceRequest>();
  #choiceResponse$ = new Subject<MfaChoiceResponse>();

  #choiceSubscription?: Subscription;
  #challengeSubscription?: Subscription;

  constructor(secretsService: SecretsService) {
    this.#storage = new SeedlessTokenStorage(secretsService);
  }

  async #getSession() {
    const session = await CubeSigner.loadSignerSession(this.#storage);

    return session;
  }

  onUnlock() {
    this.#challengeSubscription = this.#challengeRequest$.subscribe(
      (request) => {
        this.#eventEmitter.emit(SeedlessEvents.MfaRequest, request);
      }
    );

    this.#choiceSubscription = this.#choiceRequest$.subscribe((request) => {
      this.#eventEmitter.emit(SeedlessEvents.MfaChoiceRequest, request);
    });
  }

  onLock() {
    this.#challengeSubscription?.unsubscribe();
    this.#choiceSubscription?.unsubscribe();
  }

  async askForMfaMethod(
    mfaChoiceRequest: MfaChoiceRequest
  ): Promise<RecoveryMethod> {
    this.#choiceRequest$.next(mfaChoiceRequest);

    // Wait for the user to respond to our request for MFA choice
    return firstValueFrom(
      this.#choiceResponse$.pipe(
        filter((response) => response.mfaId === mfaChoiceRequest.mfaId),
        map((response: MfaChoiceResponse) => response.chosenMethod)
      )
    );
  }

  async getRecoveryMethods(): Promise<RecoveryMethod[]> {
    const session = await this.#getSession();
    const user = await session.user();

    return user.mfa.map((method) => {
      if (method.type === 'fido') {
        return {
          ...method,
          type: MfaRequestType.Fido,
        };
      }

      return {
        type: MfaRequestType.Totp,
      };
    });
  }

  async initAuthenticatorChange(tabId?: number): Promise<TotpResetChallenge> {
    const session = await this.#getSession();
    const response = await session.resetTotpStart(TOTP_ISSUER);

    if (response.requiresMfa()) {
      const methods = await this.getRecoveryMethods();
      const method =
        methods.length === 1
          ? methods[0]
          : await this.askForMfaMethod({
              mfaId: response.mfaId(),
              availableMethods: methods,
              tabId,
            });

      const result = await this.#approveWithMfa(
        method?.type === 'totp' ? MfaRequestType.Totp : MfaRequestType.Fido,
        response,
        tabId
      );

      const data = result.data();

      return {
        totpId: data.totpId,
        totpUrl: data.totpUrl,
      };
    }

    const data = response.data();

    return {
      totpId: data.totpId,
      totpUrl: data.totpUrl,
    };
  }

  async completeAuthenticatorChange(totpId: string, code: string) {
    const session = await this.#getSession();

    try {
      await session.resetTotpComplete(totpId, code);

      this.#eventEmitter.emit(
        SeedlessEvents.MfaMethodsUpdated,
        await this.getRecoveryMethods()
      );
    } catch (err) {
      // Only repeat the prompt if it was an MFA failure
      if (isFailedMfaError(err)) {
        // Emit error & retry
        throw AuthErrorCode.InvalidTotpCode;
      }

      throw err;
    }
  }

  async #approveWithMfa<T>(
    type: MfaRequestType,
    request: CubeSignerResponse<T>,
    tabId?: number
  ): Promise<CubeSignerResponse<T>> {
    try {
      if (type === MfaRequestType.Totp) {
        const code = await this.requestMfa({
          mfaId: request.mfaId(),
          type: MfaRequestType.Totp,
          tabId,
        });

        return await request.approveTotp(await this.#getSession(), code);
      } else if (type === MfaRequestType.Fido) {
        const session = await this.#getSession();
        const challenge = await session.fidoApproveStart(request.mfaId());

        const fidoAnswer = await this.requestMfa({
          mfaId: request.mfaId(),
          type,
          options: challenge.options,
          tabId,
        });

        const mfaInfo = await challenge.answer(fidoAnswer);

        if (!mfaInfo.receipt) {
          throw new Error('Fido challenge not approved');
        }

        return await request.signWithMfaApproval({
          mfaId: request.mfaId(),
          mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
          mfaConf: mfaInfo.receipt.confirmation,
        });
      } else {
        throw new Error('Unsupported MFA type');
      }
    } catch (err) {
      // Only repeat the prompt if it was an MFA failure
      if (isFailedMfaError(err)) {
        // Emit error & retry
        await this.emitMfaError(request.mfaId(), tabId);

        return this.#approveWithMfa(type, request, tabId);
      }

      throw err;
    }
  }

  async requestMfa(mfaRequest: MfaTotpRequest): Promise<string>;
  async requestMfa(mfaRequest: MfaFidoRequest): Promise<DecodedFIDOResult>;
  async requestMfa(
    mfaRequest: MfaRequestData
  ): Promise<string | DecodedFIDOResult> {
    this.#challengeRequest$.next(mfaRequest);

    // Wait for the user to respond to the MFA challenge
    return firstValueFrom(
      this.#challengeResponse$.pipe(
        filter((response) => response.mfaId === mfaRequest.mfaId),
        map((response: MfaResponseData) => response.code ?? response.answer)
      )
    );
  }

  async emitMfaError(mfaId: string, tabId?: number) {
    this.#eventEmitter.emit(SeedlessEvents.MfaFailure, { mfaId, tabId });
  }

  async submitMfaResponse(mfaResponse: MfaResponseData) {
    this.#challengeResponse$.next(mfaResponse);
  }

  async submitChosenMethod(method: MfaChoiceResponse) {
    this.#choiceResponse$.next(method);
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
    event: SeedlessEvents.MfaChoiceRequest,
    callback: (data: MfaChoiceRequest) => void
  );
  addListener(
    event: SeedlessEvents.MfaMethodsUpdated,
    callback: (data: RecoveryMethod[]) => void
  );
  addListener(
    event:
      | SeedlessEvents.MfaFailure
      | SeedlessEvents.MfaRequest
      | SeedlessEvents.MfaChoiceRequest
      | SeedlessEvents.MfaMethodsUpdated,
    callback: (data) => void
  ) {
    this.#eventEmitter.on(event, callback);
  }
}
