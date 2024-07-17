import { bnToBig } from '@avalabs/utils-sdk';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { AssetBalance } from '@src/pages/Bridge/models';
import { useMemo } from 'react';
import { formatTokenAmount } from '@avalabs/bridge-sdk';
import Big from 'big.js';
import BN from 'bn.js';
import { partition } from 'lodash';

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export interface DisplayToken {
  name: string;
  symbol: string;
  displayValue: string;
  token: TokenWithBalance | AssetBalance;
}

export const useDisplaytokenlist = ({
  tokensList,
  bridgeTokensList,
  searchQuery,
}: {
  tokensList?: TokenWithBalance[];
  bridgeTokensList?: AssetBalance[];
  searchQuery: string;
}) => {
  const displayTokenList: DisplayToken[] = useMemo(() => {
    const initialList = [
      ...(tokensList
        ? tokensList
            .filter((token) =>
              searchQuery.length
                ? token.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                : true
            )
            .map((token): DisplayToken => {
              return {
                name: token.name,
                symbol: token.symbol,
                displayValue: token.balanceDisplayValue ?? '',
                token,
              };
            })
        : []),
      ...(bridgeTokensList
        ? bridgeTokensList
            .filter((token) =>
              searchQuery.length
                ? token.symbol
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  token.symbolOnNetwork
                    ?.toLowerCase()
                    .includes(searchQuery.toLocaleLowerCase())
                : true
            )
            .map((token): DisplayToken => {
              return {
                name: token.symbolOnNetwork || token.symbol,
                symbol: token.asset.symbol,
                displayValue: formatBalance(token.balance),
                token,
              };
            })
        : []),
    ];

    const [tokensWithBalance, tokensWithoutBalance]: DisplayToken[][] =
      partition(initialList, (token) => {
        if (!token.token?.balance) {
          return -1;
        }
        const balance =
          token.token.balance instanceof BN
            ? bnToBig(token.token.balance)
            : token.token.balance;
        return balance.gt(new Big(0));
      });

    // Sorting specification per: https://ava-labs.atlassian.net/browse/CP-7768
    // First part of the list should be tokens with a balance sorted by balance (descending)
    // Second part of the list should be all no balance assets in order alphabetically
    return [
      ...tokensWithBalance.sort((tokenOne, tokenTwo) => {
        const firstBalance =
          tokenOne.token.balance instanceof BN
            ? bnToBig(tokenOne.token.balance)
            : tokenOne.token.balance || new Big(0);
        const secondBalance =
          tokenTwo.token.balance instanceof BN
            ? bnToBig(tokenTwo.token.balance)
            : tokenTwo.token.balance || new Big(0);
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
  }, [tokensList, bridgeTokensList, searchQuery]);
  return displayTokenList;
};
