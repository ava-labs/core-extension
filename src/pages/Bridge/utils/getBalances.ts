import { Asset, isBtcAsset, isNativeAsset } from '@avalabs/core-bridge-sdk';
import { AssetBalance } from '@src/pages/Bridge/models';
import { BridgeAsset } from '@avalabs/bridge-unified';
import { isUnifiedBridgeAsset } from './isUnifiedBridgeAsset';
import { normalizeBalance } from '@src/utils/normalizeBalance';
import {
  NetworkTokenWithBalance,
  TokenType,
  TokenWithBalance,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';

/**
 * Get balances of wrapped erc20 tokens on Avalanche
 * @param assets
 * @param tokens
 */
export function getBalances(
  assets: Array<Asset | BridgeAsset>,
  tokens: TokenWithBalance[]
): AssetBalance[] {
  const tokensByAddress = tokens.reduce<{
    [address: string]:
      | TokenWithBalanceERC20
      | NetworkTokenWithBalance
      | undefined;
  }>((tokensMap, token) => {
    if (token.type !== TokenType.ERC20 && token.type !== TokenType.NATIVE) {
      return tokensMap;
    }

    if (token.type !== TokenType.ERC20) {
      tokensMap[token.symbol.toLowerCase()] = token;
      return tokensMap;
    }
    // Need to convert the keys to lowercase because they are mixed case, and this messes up or comparison function
    tokensMap[token.address.toLowerCase()] = token;
    return tokensMap;
  }, {});

  return assets.map((asset) => {
    const symbol = asset.symbol;
    const token = isUnifiedBridgeAsset(asset)
      ? tokensByAddress[asset.address?.toLowerCase() ?? asset.symbol]
      : isNativeAsset(asset)
      ? tokensByAddress[asset.symbol.toLowerCase()]
      : isBtcAsset(asset)
      ? tokensByAddress[asset.wrappedContractAddress.toLowerCase()]
      : tokensByAddress[asset.wrappedContractAddress?.toLowerCase()] ||
        tokensByAddress[asset.nativeContractAddress?.toLowerCase()];

    const balance = token && normalizeBalance(token.balance, token.decimals);
    const logoUri = token?.logoUri;
    const price = token?.priceInCurrency;

    return { symbol, asset, balance, logoUri, price };
  });
}
