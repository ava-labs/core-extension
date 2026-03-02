import { TokenType } from '@avalabs/unified-asset-transfer';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

type AssetLike =
  | {
      type: TokenType.NATIVE;
    }
  | {
      type: TokenType.ERC20 | TokenType.SPL;
      address: string;
    };

export const lookupTokenByAssetInfo = (
  tokensByChainId: FungibleTokenBalance[],
  assetLike: AssetLike,
) => {
  if (assetLike.type === TokenType.NATIVE) {
    return tokensByChainId.find((token) => token.type === VmTokenType.NATIVE);
  }

  if (assetLike.type === TokenType.ERC20) {
    return tokensByChainId.find(
      (token) =>
        token.type === VmTokenType.ERC20 && token.address === assetLike.address,
    );
  }

  return tokensByChainId.find(
    (token) =>
      token.type === VmTokenType.SPL && token.address === assetLike.address,
  );
};
