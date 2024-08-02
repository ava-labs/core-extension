import BN from 'bn.js';

import { TokenWithBalance } from '@src/background/services/balances/models';
import { TokenWithBalanceBTC } from '@avalabs/vm-module-types';

export const hasUnconfirmedBalance = (
  token: TokenWithBalance
): token is TokenWithBalanceBTC & { unconfirmedBalance: BN } => {
  return 'unconfirmedBalance' in token && Boolean(token.unconfirmedBalance);
};
