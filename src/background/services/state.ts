import { filterFalseyValues } from '@src/utils/filterFalsyValues';
import { stateLog } from '@src/utils/logging';
import { combineLatest, map, throttleTime } from 'rxjs';
import { contacts$ } from './contacts/contacts';
import { onboardingStatus$ } from './onboarding/onboardingFlows';
import { permissions$ } from './permissions/permissions';
import {
  pendingTransactions$,
  transactions$,
} from './transactions/transactions';
import {
  network$,
  recentTxHistory$,
  wallet$,
} from '@avalabs/wallet-react-components';
import { walletState$ } from './wallet/walletState';
import { settings$ } from './settings/settings';
import { favorites$ } from './favorites/favorites';
import { accounts$ } from './accounts/accounts';
import { paraSwap$ } from './swap/swap';
import { ledgerState$ } from './ledger/ledger';
import './network/network'; // Force load because it has no exports

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
  pendingTransactions$.pipe(toStructure('transactionsPending')),
  permissions$.pipe(toStructure('permissions')),
  onboardingStatus$.pipe(filterFalseyValues(), toStructure('onboardingStatus')),
  network$.pipe(toStructure('network')),
  walletState$.pipe(filterFalseyValues(), toStructure('walletState')),
  settings$.pipe(toStructure('settingsState')),
  contacts$.pipe(toStructure('contactsState')),
  recentTxHistory$.pipe(toStructure('recentTxHistory')),
  accounts$.pipe(toStructure('accounts')),
  favorites$.pipe(toStructure('favoritesState')),
  paraSwap$.pipe(toStructure('paraswap')),
  ledgerState$.pipe(toStructure('ledger')),
])
  .pipe(throttleTime(500), map(mapToState))
  .subscribe((state) => stateLog(state));
