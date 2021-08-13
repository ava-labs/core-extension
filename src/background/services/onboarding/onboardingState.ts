import { EMPTY, from, switchMap } from 'rxjs';
import { onboardingFromStorage } from './storage';
import { onboardingCurrentPhase, onboardingFlow } from './onboardingFlows';

export const onboardingStateUpdates = from(onboardingFromStorage()).pipe(
  switchMap((state) => {
    return state.isOnBoarded ? onboardingFlow : EMPTY;
  })
);

export const onboardingPhaseUpdates = onboardingCurrentPhase.asObservable();
