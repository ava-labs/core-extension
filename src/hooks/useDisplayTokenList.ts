import { TokenWithBalance } from '@src/background/services/balances/models';
import { AssetBalance } from '@src/pages/Bridge/models';
import { useMemo } from 'react';
import { formatTokenAmount } from '@avalabs/core-bridge-sdk';
import Big from 'big.js';
import { partition } from 'lodash';
import { isUnifiedBridgeAsset } from '@src/pages/Bridge/utils/isUnifiedBridgeAsset';
import { normalizeBalance } from '@src/utils/normalizeBalance';

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export interface DisplayToken {
  name: string;
  symbol: string;
  displayValue: string;
  token: TokenWithBalance | AssetBalance;
  decimals: number;
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
                decimals: token.decimals,
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
                decimals: isUnifiedBridgeAsset(token.asset)
                  ? token.asset.decimals
                  : token.asset.denomination,
              };
            })
        : []),
    ];

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
  }, [tokensList, bridgeTokensList, searchQuery]);
  return displayTokenList;
};
