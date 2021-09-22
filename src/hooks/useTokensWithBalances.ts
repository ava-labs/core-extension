import { useWalletContext } from '@src/contexts/WalletProvider';
import { useEffect, useMemo, useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { useTheme } from 'styled-components';
import {
  getAvaxBalanceTotal,
  getAvaxBalanceUSD,
} from '@src/pages/Wallet/utils/balanceHelpers';
import { ERC20 } from '@avalabs/wallet-react-components';

export const AVAX_TOKEN = {
  name: 'Avalanche',
  symbol: 'AVAX',
  isAvax: true,
};

/**
 * The goal here is to normalize the data between Ant, Avax and ERC20. All display values should be
 * normalized as well and we provide a few type guards to filter and type back tot he expected type
 * for the respected entity.
 */
export interface TokenWithBalance extends ERC20 {
  name: string;
  symbol: string;
  logoURI?: string;
  isErc20?: boolean;
  isAvax?: boolean;
  balanceDisplayValue: string;
  balanceUsdDisplayValue: string;
  color: string;
}

const bnZero = new BN(0);

export function isERC20Token(
  token: TokenWithBalance | any
): token is ERC20 & TokenWithBalance {
  return !!token.isErc20;
}

export function isAvaxToken(
  token: TokenWithBalance
): token is typeof AVAX_TOKEN & TokenWithBalance {
  return !!token.isAvax;
}

export function useTokensWithBalances() {
  const { erc20Tokens, balances, avaxPrice } = useWalletContext();

  const theme = useTheme();

  const tokenColors = [
    theme.colors.pink['500'],
    theme.colors.green['500'],
    theme.colors.orange['500'],
    theme.colors.turquoise['500'],
    '#9C27B0', // purple 500
    '#2196F3', // blue 500
    '#EEFF41', // lime A200
  ];

  return useMemo<TokenWithBalance[]>(() => {
    const erc20TokensWithBalances = erc20Tokens
      ?.filter((token) => token.balance.gt(bnZero))
      .map((token) => {
        return {
          ...token,
          isErc20: true,
          color: '',
          balanceDisplayValue: parseFloat(token.balanceParsed).toFixed(3),
          balanceUsdDisplayValue: '',
        };
      });

    /**
     * sorting by balance and then mutating so that it has its color to show in the portfolio
     * dashboard balances. Not ideal to mutate but clean enough implementation for now
     */

    erc20TokensWithBalances
      .sort((a, b) => (a.balance.gt(b.balance) ? 1 : 0))
      .forEach((token, idx) => {
        token.color = tokenColors[idx] ?? '';
      });

    /**
     * creating a object to represent the avax token, if a balance for this token is
     * greater than 0
     */
    const avaxToken: any = balances.balanceAvaxTotal.gt(bnZero)
      ? [
          {
            ...AVAX_TOKEN,
            balance: balances.balanceAvaxTotal,
            isAvax: true,
            color: theme.colors.primary[400] as string,
            balanceDisplayValue: parseFloat(
              getAvaxBalanceTotal(balances.balanceAvaxTotal)
            ).toFixed(3),
            balanceUsdDisplayValue: parseFloat(
              getAvaxBalanceUSD(balances.balanceAvaxTotal, avaxPrice)
            ).toFixed(3),
          },
        ]
      : [];

    return [...avaxToken, ...erc20TokensWithBalances];
  }, [erc20Tokens, balances.balanceAvaxTotal.toString(), avaxPrice]);
}
