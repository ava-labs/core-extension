import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { isNFT } from '@core/common';
import { orderBy } from 'lodash';
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
const sortTokens = (tokens: DisplayToken[]): DisplayToken[] =>
  orderBy(
    tokens,
    [
      isNativeToken,
      hasCurrencyValue,
      'token.balanceInCurrency',
      'token.balance',
      'token.name',
    ],
    ['desc', 'desc', 'desc', 'desc', 'asc'], // isNativeToken and hasCurrencyValue return booleans and true > false (1 > 0)
  );

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
