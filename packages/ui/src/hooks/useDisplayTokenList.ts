import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { isNFT } from '@core/common';
import { useMemo } from 'react';

export interface DisplayToken<T extends TokenWithBalance = TokenWithBalance> {
  name: string;
  symbol: string;
  displayValue: string;
  token: T;
  decimals: number;
}

const hasCurrencyValue = (
  displayToken: DisplayToken,
): displayToken is DisplayToken<
  TokenWithBalance & { balanceInCurrency: number }
> => typeof displayToken.token.balanceInCurrency === 'number';

const isNativeToken = (
  displayToken: DisplayToken,
): displayToken is DisplayToken<
  TokenWithBalance & { type: TokenType.NATIVE }
> => displayToken.token.type === TokenType.NATIVE;

/**
 * Native tokens first, then tokens sorted by balance in currency, then tokens sorted by balance, then tokens sorted by symbol
 */
const sortTokens = (tokens: DisplayToken[]): DisplayToken[] => {
  const [nativeTokens, tokensWithCurrency, tokensWithoutCurrency] =
    tokens.reduce<
      [
        DisplayToken<TokenWithBalance & { type: TokenType.NATIVE }>[],
        DisplayToken<TokenWithBalance & { balanceInCurrency: number }>[],
        DisplayToken<TokenWithBalance>[],
      ]
    >(
      ([natives, withCurrencyValue, withoutCurrencyValue], displayToken) => {
        if (isNativeToken(displayToken)) {
          return [
            [...natives, displayToken],
            withCurrencyValue,
            withoutCurrencyValue,
          ];
        }

        if (hasCurrencyValue(displayToken)) {
          return [
            natives,
            [...withCurrencyValue, displayToken],
            withoutCurrencyValue,
          ];
        }

        return [
          natives,
          withCurrencyValue,
          [...withoutCurrencyValue, displayToken],
        ];
      },
      [[], [], []],
    );

  return [
    // native tokens always first
    ...nativeTokens,
    // then tokens with known fiat value
    ...tokensWithCurrency.sort(({ token: a }, { token: b }) => {
      // ...sorted by fiat value, descending
      if (a.balanceInCurrency !== b.balanceInCurrency) {
        return b.balanceInCurrency - a.balanceInCurrency;
      }

      // if fiat value is the same, then sort by balance (desc)
      if (a.balance !== b.balance) {
        return Number(BigInt(b.balance) - BigInt(a.balance));
      }

      // if balance is the same, then sort by name (asc)
      return a.name.localeCompare(b.name);
    }),
    // tokens with unknown fiat value come last
    ...tokensWithoutCurrency.sort(({ token: a }, { token: b }) => {
      // sorted by balance (desc)
      if (a.balance !== b.balance) {
        return Number(BigInt(b.balance) - BigInt(a.balance));
      }

      // if balance is the same, then sort by name (asc)
      return a.name.localeCompare(b.name);
    }),
  ];
};

export const useDisplaytokenlist = ({
  tokensList,
  searchQuery,
}: {
  tokensList?: TokenWithBalance[];
  searchQuery: string;
}) => {
  const displayTokenList: DisplayToken[] = useMemo(() => {
    const initialList = (tokensList ?? [])
      .filter((token) =>
        searchQuery.length
          ? token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
          : true,
      )
      .map((token): DisplayToken => {
        return {
          name: token.name,
          symbol: token.symbol,
          displayValue: token.balanceDisplayValue ?? '',
          token,
          decimals: isNFT(token) ? 0 : token.decimals,
        };
      });

    return sortTokens(initialList);
  }, [tokensList, searchQuery]);
  return displayTokenList;
};
