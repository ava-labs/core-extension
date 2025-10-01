import {
  BridgeAsset,
  TokenType as BridgeTokenType,
} from '@avalabs/bridge-unified';

import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';

export const findMatchingBridgeAsset = (
  assets: BridgeAsset[],
  token: Exclude<TokenWithBalance, NftTokenWithBalance>,
): BridgeAsset | undefined => {
  return assets.find((a) => {
    console.log('findMatchingBridgeAsset', { a, token });
    if (a.type === BridgeTokenType.NATIVE && token.type === TokenType.NATIVE) {
      return a.symbol.toLowerCase() === token.symbol.toLowerCase();
    }

    if (a.type === BridgeTokenType.ERC20 && token.type === TokenType.ERC20) {
      return a.address.toLowerCase() === token.address.toLowerCase();
    }

    return false;
  });
};
