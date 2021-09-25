import { useWalletContext } from '@src/contexts/WalletProvider';
import { useMemo } from 'react';
import { AssetBalanceX, BN } from '@avalabs/avalanche-wallet-sdk';
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
  balance: new BN(0),
};

/**
 * The goal here is to normalize the data between Ant, Avax and ERC20. All display values should be
 * normalized as well and we provide a few type guards to filter and type back tot he expected type
 * for the respected entity.
 */
export interface TokenWithBalance {
  name: string;
  symbol: string;
  logoURI?: string;
  isErc20?: boolean;
  isAvax?: boolean;
  isAnt?: boolean;
  balanceDisplayValue: string;
  balanceUsdDisplayValue: string;
  color: string;
}

export type ERC20WithBalance = TokenWithBalance & ERC20;
export type AntWithBalance = TokenWithBalance & AssetBalanceX['meta'];
export type AvaxWithBalance = TokenWithBalance & typeof AVAX_TOKEN;

const bnZero = new BN(0);

export function isERC20Token(
  token: TokenWithBalance | any
): token is ERC20WithBalance {
  return !!token.isErc20;
}

export function isAvaxToken(token: TokenWithBalance): token is AvaxWithBalance {
  return !!token.isAvax;
}

export function isAntToken(token: TokenWithBalance): token is AvaxWithBalance {
  return !!token.isAnt;
}

export function useTokensWithBalances() {
  const { erc20Tokens, avaxPrice, antTokens, avaxToken } = useWalletContext();

  return useMemo<TokenWithBalance[]>(() => {
    return [
      avaxToken,
      ...erc20Tokens.filter((token) => token.balance.gt(bnZero)),
      ...antTokens,
    ];
  }, [erc20Tokens, avaxToken, avaxPrice, antTokens]);
}
