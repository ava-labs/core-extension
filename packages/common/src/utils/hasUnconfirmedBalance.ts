import BN from 'bn.js';

import {
  TokenWithBalance,
  TokenWithBalanceBTC,
} from '@avalabs/vm-module-types';

export const hasUnconfirmedBalance = (
  token: TokenWithBalance,
): token is TokenWithBalanceBTC & { unconfirmedBalance: BN } => {
  return (
    ('unconfirmedBalance' satisfies keyof TokenWithBalanceBTC) in token &&
    Boolean(token.unconfirmedBalance)
  );
};
