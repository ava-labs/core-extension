import { filterFalseyValues } from '@src/utils/filterFalsyValues';
import { stateLog } from '@src/utils/logging';
import { combineLatest, map, throttleTime } from 'rxjs';
import { messages$ } from './messages/messages';
import { onboardingStatus$ } from './onboarding/onboardingFlows';
import { permissions$ } from './permissions/permissions';
import { transactions$ } from './transactions/transactions';
import { wallet$ } from '@avalabs/wallet-react-components';
import { walletState$ } from './wallet/walletState';
import { currentNetwork$ } from './network/network';
import { settings$ } from './settings/settings';

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
  currentNetwork$.pipe(toStructure('network')),
  messages$.pipe(toStructure('messages')),
  walletState$.pipe(filterFalseyValues(), toStructure('walletState')),
  settings$.pipe(toStructure('settingsState')),
])
  .pipe(throttleTime(500), map(mapToState))
  .subscribe((state) => stateLog(state));
