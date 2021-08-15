import {
  combineLatest,
  filter,
  map,
  Observable,
  OperatorFunction,
  take,
} from 'rxjs';
import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
} from '../../connections/models';
import { wallet } from '../wallet/wallet';
import { OnboardingPhase, OnboardingState } from './models';
import {
  onboardingCurrentPhase,
  onboardingFinalized,
  onboardingMnemonic,
  onboardingPassword,
  onboardingStatus,
} from './onboardingFlows';

import { getOnboardingFromStorage } from './storage';
export async function getIsOnBoarded(request: ExtensionConnectionMessage) {
  const result = await getOnboardingFromStorage();
  return {
    ...request,
    result,
  };
}

export async function setWalletImportOrCreatePhase(
  request: ExtensionConnectionMessage
) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: new Error('params missing from request'),
    };
  }

  const phase =
    params[0] === OnboardingPhase.CREATE_WALLET
      ? OnboardingPhase.CREATE_WALLET
      : params[0] === OnboardingPhase.IMPORT_WALLET
      ? OnboardingPhase.IMPORT_WALLET
      : undefined;

  if (!phase) {
    return {
      ...request,
      error: new Error('phase incorrect for request'),
    };
  }

  onboardingCurrentPhase.next(phase);

  return {
    ...request,
    result: true,
  };
}

export async function setWalletMnemonic(request: ExtensionConnectionMessage) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: new Error('params missing from request'),
    };
  }

  const mnemonic = params.pop();

  if (!mnemonic) {
    return {
      ...request,
      error: new Error('mnemonic missing for request'),
    };
  }

  onboardingMnemonic.next(mnemonic);
  onboardingCurrentPhase.next(OnboardingPhase.PASSWORD);
  return {
    ...request,
    result: true,
  };
}

export async function setWalletPassword(request: ExtensionConnectionMessage) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: new Error('params missing from request'),
    };
  }

  const password = params.pop();

  if (!password) {
    return {
      ...request,
      error: new Error('password missing for request'),
    };
  }

  onboardingPassword.next(password);
  onboardingCurrentPhase.next(OnboardingPhase.CONFIRM);

  return {
    ...request,
    result: true,
  };
}

export async function setOnboardingFinalized(
  request: ExtensionConnectionMessage
) {
  onboardingFinalized.next(true);

  return {
    ...request,
    result: true,
  };
}

const ONBOARDING_UPDATED_EVENT = 'onboarding_finalized';
export function onboardingUpdatedEvent() {
  return combineLatest([onboardingStatus, wallet]).pipe(
    map(([onboarded, wallet]) => ({
      name: ONBOARDING_UPDATED_EVENT,
      value:
        onboarded && onboarded.isOnBoarded && !!wallet
          ? { isOnBoarded: true }
          : { isOnBoarded: false },
    }))
  );
}

const ONBOARDING_PHASE_UPDATED_EVENT = 'onboarding_phase';
export function onboardingPhaseUpdatedEvent(): Observable<
  ExtensionConnectionEvent<OnboardingPhase>
> {
  return onboardingCurrentPhase.pipe(
    filter((value) => value !== undefined) as OperatorFunction<
      OnboardingPhase | undefined,
      OnboardingPhase
    >,
    map((value) => ({
      name: ONBOARDING_PHASE_UPDATED_EVENT,
      value,
    }))
  );
}

export function onboardingUpdatedEventListener(
  evt: ExtensionConnectionEvent<OnboardingState>
) {
  return evt.name === ONBOARDING_UPDATED_EVENT;
}

export function onboardingPhaseUpdatedEventListener(
  evt: ExtensionConnectionEvent<OnboardingPhase>
) {
  return evt.name === ONBOARDING_PHASE_UPDATED_EVENT;
}
