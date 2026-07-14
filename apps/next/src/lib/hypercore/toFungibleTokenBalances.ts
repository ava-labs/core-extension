import { TokenType } from '@avalabs/vm-module-types';
import type { HypercoreTokenBalance } from '@avalabs/hypercore-module';
import {
  HYPERCORE_USDC_DECIMALS,
  HYPERCORE_USDC_NAME,
  HYPERCORE_USDC_SYMBOL,
  hyperliquidCoinSvgUrl,
} from '@avalabs/hypercore-module';
import { chainIdToCaip, HYPERCORE_CHAIN_ID } from '@core/common';
import type { FungibleTokenBalance, NetworkWithCaipId } from '@core/types';

const toBalanceInCurrency = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Maps HyperCore module balances into portfolio `FungibleTokenBalance` rows.
 * USDC is native @ $1; other spot inventory is `HYPERCORE_SPOT`.
 */
export const toFungibleTokenBalances = (
  tokens: readonly HypercoreTokenBalance[],
  network?: NetworkWithCaipId,
): FungibleTokenBalance[] => {
  const coreChainId = network?.chainId ?? HYPERCORE_CHAIN_ID;
  const chainCaipId = network?.caipId ?? chainIdToCaip(coreChainId);

  return tokens.map((token): FungibleTokenBalance => {
    const balance = BigInt(token.balanceRaw);
    const logoUri = hyperliquidCoinSvgUrl(token.symbol);

    if (token.kind === 'native') {
      const balanceInCurrency = toBalanceInCurrency(token.balanceUsd);

      return {
        type: TokenType.NATIVE,
        assetType: 'evm_native',
        name: token.name || HYPERCORE_USDC_NAME,
        symbol: token.symbol || HYPERCORE_USDC_SYMBOL,
        decimals: token.decimals || HYPERCORE_USDC_DECIMALS,
        balance,
        balanceDisplayValue: token.balance,
        balanceInCurrency,
        balanceCurrencyDisplayValue: token.balanceUsd,
        priceInCurrency: token.priceUsd,
        logoUri,
        coingeckoId: 'usd-coin',
        coreChainId,
        chainCaipId,
      };
    }

    return {
      type: TokenType.HYPERCORE_SPOT,
      assetType: 'hypercore_spot',
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      index: token.index,
      evmContract: token.evmContract,
      balance,
      balanceDisplayValue: token.balance,
      logoUri,
      reputation: null,
      coreChainId,
      chainCaipId,
    };
  });
};

export const sumHypercoreBalanceInCurrency = (
  tokens: readonly FungibleTokenBalance[],
) => tokens.reduce((sum, token) => sum + (token.balanceInCurrency ?? 0), 0);
