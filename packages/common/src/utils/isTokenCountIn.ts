import { TokenWithBalance } from '@avalabs/vm-module-types';
import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { isNil } from 'lodash';

export const isTokenCountIn = (
  token: TokenWithBalance | NetworkContractToken,
) => {
  if ('reputation' in token) {
    return (
      ['Benign', 'Warning'].includes(token.reputation || '') ||
      isNil(token.reputation)
    );
  }
  return true;
};
