import { Asset, AssetType } from '@avalabs/bridge-sdk';
import { AssetBalance } from '@src/pages/Bridge/models';
import { bnToBig } from '@avalabs/utils-sdk';
import {
  TokenWithBalanceERC20,
  TokenWithBalance,
  TokenType,
} from '@src/background/services/balances/models';

/**
 * Get balances of wrapped erc20 tokens on Avalanche
 * @param assets
 * @param tokens
 */
export function getBalances(
  assets: Asset[],
  tokens: TokenWithBalance[]
): AssetBalance[] {
  const tokensByAddress = tokens.reduce<{
    [address: string]: TokenWithBalanceERC20 | TokenWithBalance | undefined;
  }>((tokens, token) => {
    if (token.type !== TokenType.ERC20) {
      tokens[token.symbol.toLowerCase()] = token;
      return tokens;
    }
    // Need to convert the keys to lowercase because they are mixed case, and this messes up or comparison function
    tokens[token.address.toLowerCase()] = token;
    return tokens;
  }, {});

  return assets.map((asset) => {
    const symbol = asset.symbol;
    const token =
      asset.assetType === AssetType.NATIVE
        ? tokensByAddress[asset.symbol.toLowerCase()]
        : asset.assetType === AssetType.BTC
        ? tokensByAddress[asset.wrappedContractAddress.toLowerCase()]
        : tokensByAddress[asset.wrappedContractAddress?.toLowerCase()] ||
          tokensByAddress[asset.nativeContractAddress?.toLowerCase()];

    const balance = token && bnToBig(token.balance, token.decimals);
    const logoUri = token?.logoUri;
    const price = token?.priceUSD;

    return { symbol, asset, balance, logoUri, price };
  });
}
