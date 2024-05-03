import BN from 'bn.js';

import {
  TokenWithBalance,
  TokenWithBalanceBTC,
} from '@src/background/services/balances/models';

export const hasUnconfirmedBalance = (
  token: TokenWithBalance
): token is TokenWithBalanceBTC & { unconfirmedBalance: BN } => {
  return 'unconfirmedBalance' in token && Boolean(token.unconfirmedBalance);
};
