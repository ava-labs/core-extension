import { useWalletContext } from '@src/contexts/WalletProvider';
import { useEffect, useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';

/**
 * The goal here is to normalize the data between Ant, Avax and ERC20 so that we can display them all
 * in a single list. Allow them to be selectable and upon selection, they would update the app search
 * params. From here it is up to the individual features to take the search params and type guard down
 * to the needed interface.
 *
 * For example:
 * Avax updates the query params to be `?token=AVAX&type=AVAX` and the
 * feature would read this from the params and create the needed state type
 * to use the feature for AVAX
 *
 * Subsequently an ERC20 would do as follows `?token=PNG&type=ERC20`
 */
export interface TokenWithBalance {
  name: string;
  symbol: string;
  logoURI?: string;
  isErc20?: boolean;
  isAvax?: boolean;
}

const bnZero = new BN(0);

export const AVAX_TOKEN = {
  name: 'Avalanche',
  symbol: 'AVAX',
  isAvax: true,
};

export function useTokensWithBalances() {
  const { erc20Tokens } = useWalletContext();
  const [tokensWBalances, setTokensWBalances] = useState<TokenWithBalance[]>(
    []
  );

  useEffect(() => {
    const erc20TokensWithBalances = erc20Tokens
      ?.filter((token) => token.balance.gt(bnZero))
      .map((token) => {
        return {
          ...token,
          isErc20: true,
        };
      });

    setTokensWBalances([...tokensWBalances, ...erc20TokensWithBalances]);
  }, [erc20Tokens]);

  return tokensWBalances;
}
