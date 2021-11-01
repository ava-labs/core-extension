import { filterFalseyValues } from '@src/utils/filterFalsyValues';
import { stateLog } from '@src/utils/logging';
import { combineLatest, map, throttleTime } from 'rxjs';
import { messages$ } from './messages/messages';
import { onboardingStatus$ } from './onboarding/onboardingFlows';
import { permissions$ } from './permissions/permissions';
import { transactions$ } from './transactions/transactions';
import {
  network$,
  recentTxHistory$,
  wallet$,
} from '@avalabs/wallet-react-components';
import { walletState$ } from './wallet/walletState';
import { settings$ } from './settings/settings';
import { favorites$ } from './favorites/favorites';

function mapToState(result): { [key: string]: any } {
  return result.reduce((acc, value) => {
    return { ...acc, ...value };
  }, {});
}

function toStructure(name: any) {
  return (observer: any) => {
    return observer.pipe(map((value) => ({ [name]: value })));
  };
}

combineLatest([
  wallet$.pipe(toStructure('wallet')),
  transactions$.pipe(toStructure('transactions')),
  permissions$.pipe(toStructure('permissions')),
  onboardingStatus$.pipe(filterFalseyValues(), toStructure('onboardingStatus')),
  network$.pipe(toStructure('network')),
  messages$.pipe(toStructure('messages')),
  walletState$.pipe(filterFalseyValues(), toStructure('walletState')),
  settings$.pipe(toStructure('settingsState')),
  recentTxHistory$.pipe(toStructure('recentTxHistory')),
  favorites$.pipe(toStructure('favoritesState')),
])
  .pipe(throttleTime(500), map(mapToState))
  .subscribe((state) => stateLog(state));
