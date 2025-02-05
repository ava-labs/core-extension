import type { TokenWithBalance } from '@avalabs/vm-module-types';
import { TokenType } from '@avalabs/vm-module-types';
import { Erc20TokenBalance } from '@avalabs/glacier-sdk';
import type { NetworkContractToken } from '@avalabs/core-chains-sdk';

export const isTokenMalicious = (
  token: TokenWithBalance | NetworkContractToken,
) => {
  if (!('type' in token) || token.type !== TokenType.ERC20) {
    return false;
  }

  return token.reputation === Erc20TokenBalance.tokenReputation.MALICIOUS;
};
