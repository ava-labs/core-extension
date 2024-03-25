import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import {
  AddFidoChallenge,
  CubeSignerResponse,
  SignerSession,
} from '@cubist-labs/cubesigner-sdk';
import { filter, firstValueFrom, map, Subject, Subscription } from 'rxjs';

import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { DecodedFIDOResult, KeyType } from '@src/utils/seedless/fido/types';

import {
  AuthErrorCode,
  GetRecoveryMethodsOptions,
  MfaChoiceRequest,
  MfaChoiceResponse,
  MfaClearData,
  MfaFailureData,
  MfaFidoRequest,
  MfaRequestData,
  MfaRequestType,
  MfaResponseData,
  MfaTotpRequest,
  RecoveryMethod,
  SeedlessError,
  SeedlessEvents,
  TOTP_ISSUER,
  TotpResetChallenge,
} from './models';
import { SeedlessTokenStorage } from './SeedlessTokenStorage';
import { SecretsService } from '../secrets/SecretsService';
import { isFailedMfaError, mapMfasToRecoveryMethods } from './utils';
import { PartialBy } from '@src/background/models';

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
    const session = SignerSession.loadSignerSession(this.#storage);

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
    mfaChoiceRequest: PartialBy<MfaChoiceRequest, 'availableMethods'>
  ): Promise<RecoveryMethod> {
    const methods =
      mfaChoiceRequest.availableMethods ?? (await this.getRecoveryMethods());

    if (methods.length === 1) {
      return methods[0]!;
    }

    this.#choiceRequest$.next({
      ...mfaChoiceRequest,
      availableMethods: methods,
    });

    // Wait for the user to respond to our request for MFA choice
    return firstValueFrom(
      this.#choiceResponse$.pipe(
        filter((response) => response.mfaId === mfaChoiceRequest.mfaId),
        map((response: MfaChoiceResponse) => response.chosenMethod)
      )
    );
  }

  async getRecoveryMethods({
    excludeFido,
    excludeTotp,
  }: GetRecoveryMethodsOptions = {}): Promise<RecoveryMethod[]> {
    const session = await this.#getSession();
    const user = await session.user();

    const methods = user.mfa.map(mapMfasToRecoveryMethods);

    if (excludeTotp || excludeFido) {
      return methods.filter((method) => {
        if (method.type === MfaRequestType.Totp && excludeTotp) {
          return false;
        }

        if (method.type === MfaRequestType.Fido && excludeFido) {
          return false;
        }

        return true;
      });
    }

    return methods;
  }

  async addFidoDevice(name: string, keyType: KeyType, tabId?: number) {
    const session = await this.#getSession();
    const addFidoRequest = await session.addFidoStart(name);

    let addFidoChallenge: AddFidoChallenge;

    if (addFidoRequest.requiresMfa()) {
      const methods = await this.getRecoveryMethods();
      const method =
        methods.length === 1
          ? methods[0]
          : await this.askForMfaMethod({
              mfaId: addFidoRequest.mfaId(),
              availableMethods: methods,
              tabId,
            });

      const mfaResponse = await this.approveWithMfa(
        method?.type === 'totp' ? MfaRequestType.Totp : MfaRequestType.Fido,
        addFidoRequest,
        tabId
      );

      addFidoChallenge = mfaResponse.data();
    } else {
      addFidoChallenge = addFidoRequest.data();
    }

    const fidoAnswer = await this.requestMfa({
      mfaId: addFidoChallenge.challengeId,
      type: MfaRequestType.FidoRegister,
      keyType,
      options: addFidoChallenge.options,
      tabId,
    });

    await addFidoChallenge.answer(fidoAnswer);
    await this.#emitMfaMethods();
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

      const result = await this.approveWithMfa(
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

  async removeTotp(tabId?: number) {
    const session = await this.#getSession();

    const request = await session.deleteTotp();

    if (request.requiresMfa()) {
      // To remove a TOTP method, FIDO verification is required.
      const methods = await this.getRecoveryMethods({ excludeTotp: true });

      // We should have non-TOTP methods available here. Technically CubeSigner
      // checks for that, but let's make sure on our end as well.
      if (!methods.length) {
        throw SeedlessError.NoMfaMethodAvailable;
      }

      await this.approveWithMfa(MfaRequestType.Fido, request, tabId);
    }

    await this.#emitMfaMethods();
  }

  async removeFidoDevice(id: string, tabId?: number) {
    const session = await this.#getSession();

    const request = await session.deleteFido(id);

    if (request.requiresMfa()) {
      // To remove a FIDO device, a TOTP verification is required.
      const [method] = await this.getRecoveryMethods({ excludeFido: true });

      // TOTP should be the only one available here. Technically CubeSigner guards from this not
      // being the case, but better make sure.
      if (!method) {
        throw SeedlessError.NoMfaMethodAvailable;
      }

      await this.approveWithMfa(MfaRequestType.Totp, request, tabId);
    }

    await this.#emitMfaMethods();
  }

  async #emitMfaMethods() {
    this.#eventEmitter.emit(
      SeedlessEvents.MfaMethodsUpdated,
      await this.getRecoveryMethods()
    );
  }

  async completeAuthenticatorChange(totpId: string, code: string) {
    const session = await this.#getSession();

    try {
      await session.resetTotpComplete(totpId, code);
      await this.#emitMfaMethods();
    } catch (err) {
      // Only repeat the prompt if the user provided a wrong code from the new authenticator app
      if (isFailedMfaError(err)) {
        // Emit error & retry
        throw AuthErrorCode.InvalidTotpCode;
      }

      throw err;
    }
  }

  async approveWithMfa<T>(
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

        const result = await request.approveTotp(
          await this.#getSession(),
          code
        );

        this.clearMfaChallenge(request.mfaId(), tabId);

        return result;
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

        const result = await request.signWithMfaApproval({
          mfaId: request.mfaId(),
          mfaOrgId: process.env.SEEDLESS_ORG_ID || '',
          mfaConf: mfaInfo.receipt.confirmation,
        });

        this.clearMfaChallenge(request.mfaId(), tabId);

        return result;
      } else {
        throw new Error('Unsupported MFA type');
      }
    } catch (err) {
      // Only repeat the prompt if it was an MFA failure
      if (isFailedMfaError(err)) {
        // Emit error & retry
        await this.emitMfaError(request.mfaId(), tabId);

        return this.approveWithMfa(type, request, tabId);
      }

      this.clearMfaChallenge(request.mfaId(), tabId);
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

  clearMfaChallenge(mfaId: string, tabId?: number) {
    this.#eventEmitter.emit(SeedlessEvents.MfaClear, { mfaId, tabId });
  }

  async submitMfaResponse(mfaResponse: MfaResponseData) {
    this.#challengeResponse$.next(mfaResponse);
  }

  async submitChosenMethod(response: MfaChoiceResponse, tabId?: number) {
    this.#choiceResponse$.next(response);
    this.clearMfaChallenge(response.mfaId, tabId);
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
    event: SeedlessEvents.MfaClear,
    callback: (data: MfaClearData) => void
  );
  addListener(
    event:
      | SeedlessEvents.MfaClear
      | SeedlessEvents.MfaFailure
      | SeedlessEvents.MfaRequest
      | SeedlessEvents.MfaChoiceRequest
      | SeedlessEvents.MfaMethodsUpdated,
    callback: (data) => void
  ) {
    this.#eventEmitter.on(event, callback);
  }
}
