import { useMemo } from 'react';
import Big from 'big.js';
import { partition } from 'lodash';
import { normalizeBalance } from '@src/utils/normalizeBalance';
import type { TokenWithBalance } from '@avalabs/vm-module-types';
import { isNFT } from '@src/background/services/balances/nft/utils/isNFT';

export interface DisplayToken {
  name: string;
  symbol: string;
  displayValue: string;
  token: TokenWithBalance;
  decimals: number;
}

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

    const [tokensWithBalance, tokensWithoutBalance]: DisplayToken[][] =
      partition(initialList, (token) => {
        const balance = normalizeBalance(token.token.balance, token.decimals);

        return balance ? balance.gt(new Big(0)) : false;
      });

    // Sorting specification per: https://ava-labs.atlassian.net/browse/CP-7768
    // First part of the list should be tokens with a balance sorted by balance (descending)
    // Second part of the list should be all no balance assets in order alphabetically
    return [
      ...tokensWithBalance.sort((tokenOne, tokenTwo) => {
        const firstBalance =
          normalizeBalance(tokenOne.token.balance, tokenOne.decimals) ??
          new Big(0);

        const secondBalance =
          normalizeBalance(tokenTwo.token.balance, tokenTwo.decimals) ??
          new Big(0);

        const comparison = firstBalance.cmp(secondBalance);
        if (comparison) {
          return comparison * -1;
        }
        return tokenOne.name.localeCompare(tokenTwo.name);
      }),
      ...tokensWithoutBalance.sort((tokenOne, tokenTwo) => {
        return tokenOne.name.localeCompare(tokenTwo.name);
      }),
    ];
  }, [tokensList, searchQuery]);
  return displayTokenList;
};
