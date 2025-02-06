import type BN from 'bn.js';

import type {
  TokenWithBalance,
  TokenWithBalanceBTC,
} from '@avalabs/vm-module-types';

export const hasUnconfirmedBalance = (
  token: TokenWithBalance,
): token is TokenWithBalanceBTC & { unconfirmedBalance: BN } => {
  return 'unconfirmedBalance' in token && Boolean(token.unconfirmedBalance);
};
