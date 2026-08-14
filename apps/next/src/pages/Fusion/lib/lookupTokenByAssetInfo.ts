import { TokenType } from '@avalabs/fusion-sdk';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

import {
  HYPERLIQUID_USDC_TOKEN_ADDRESS,
  isHypercoreUsdcToken,
} from './isHypercoreUsdcToken';

export type AssetLike =
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
    const byAddress = tokensByChainId.find(
      (token) =>
        token.type === VmTokenType.ERC20 && token.address === assetLike.address,
    );

    if (byAddress) {
      return byAddress;
    }

    // HyperCore USDC is NATIVE in balances but Markr quotes it as ERC20 zero-address.
    if (
      assetLike.address.toLowerCase() ===
      HYPERLIQUID_USDC_TOKEN_ADDRESS.toLowerCase()
    ) {
      return tokensByChainId.find(isHypercoreUsdcToken);
    }

    return undefined;
  }

  return tokensByChainId.find(
    (token) =>
      token.type === VmTokenType.SPL && token.address === assetLike.address,
  );
};
