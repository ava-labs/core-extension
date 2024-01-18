import { Blockchain, getNativeSymbol } from '@avalabs/bridge-sdk';
import { Chain } from '@avalabs/bridge-unified';

export const getNativeTokenSymbol = (chain: Blockchain | Chain) => {
  if (typeof chain === 'object') {
    return chain.networkToken.symbol;
  }

  return getNativeSymbol(chain);
};
