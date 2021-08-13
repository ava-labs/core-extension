import { formatAndLog } from '@src/background/utils/logging';
import { wallet } from './wallet';
import { walletLocked } from './walletLocked';

wallet.subscribe((wallet) => {
  formatAndLog('wallet initialized', wallet);
});

import { walletState } from './walletState';

walletState.subscribe((state) => {
  formatAndLog('wallet state initialized', state);
});

walletLocked.subscribe((lockedState) =>
  formatAndLog('wallet locked state', lockedState)
);
