import { combineLatest, map } from 'rxjs';
import { onboardingService } from '../onboarding/onboarding';
import { wallet } from './wallet';

export const walletLocked = combineLatest([
  wallet,
  onboardingService.onboarding,
]).pipe(
  map(([wallet, onboardingState]) => {
    return !!wallet && onboardingState.isOnBoarded;
  })
);
