import { formatAndLog } from '@src/background/utils/logging';
import { wallet } from './wallet';

wallet.subscribe((wallet) => {
  formatAndLog('wallet initialized', wallet);
});

import { walletState } from './walletState';

walletState.subscribe((state) => {
  formatAndLog('wallet state initialized', state);
});
