import { stateLog } from '@src/utils/logging';
import { combineLatest, throttleTime } from 'rxjs';
import { messages$ } from './messages/messages';
import { network$ } from './network/network';
import { onboardingStatus$ } from './onboarding/onboardingFlows';
import { permissions$ } from './permissions/permissions';
import { transactions$ } from './transactions/transactions';
import { wallet$ } from './wallet/wallet';
import { walletState$ } from './wallet/walletState';

combineLatest([
  wallet$,
  transactions$,
  permissions$,
  onboardingStatus$,
  network$,
  messages$,
  walletState$,
])
  .pipe(throttleTime(500))
  .subscribe((state) => stateLog(state));
