import { TokenWithBalance } from '@src/background/services/balances/models';
import { AssetBalance } from '@src/pages/Bridge/models';
import { useMemo } from 'react';
import { formatTokenAmount } from '@avalabs/bridge-sdk';
import Big from 'big.js';

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
    return [
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
  }, [tokensList, bridgeTokensList, searchQuery]);
  return displayTokenList;
};
