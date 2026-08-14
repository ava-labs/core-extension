import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { isTokenCountIn } from './isTokenCountIn';

export const isTokenMalicious = (
  token: TokenWithBalance | NetworkContractToken,
) => {
  if (!('type' in token) || token.type !== TokenType.ERC20) {
    return false;
  }

  return !isTokenCountIn(token);
};
