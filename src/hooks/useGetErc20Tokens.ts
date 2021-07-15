import { useStore } from '@src/store/store';
import { ERC20 } from '@src/store/wallet/types';
import { useEffect, useState } from 'react';

function indexTokensByAddress(tokens: ERC20[]) {
  return tokens.reduce<{ [key: string]: ERC20 }>((acc, token) => {
    return {
      ...acc,
      [token.address]: token,
    };
  }, {});
}

const FUJI_LIST = fetch(
  'https://raw.githubusercontent.com/dasconnor/tokenlist/main/fuji.tokenlist.json'
)
  .then((response) => response.json())
  .then((res) => res.tokens)
  .then(indexTokensByAddress);
const MAINNET_LIST = fetch(
  'https://raw.githubusercontent.com/pangolindex/tokenlists/main/top15.tokenlist.json'
)
  .then((response) => response.json())
  .then((res) => res.tokens)
  .then(indexTokensByAddress);

export function useGetErc20Tokens() {
  const [tokens, setTokens] = useState<ERC20[]>();
  const { walletStore, networkStore } = useStore();

  useEffect(() => {
    (async function () {
      const tokenIndex = await await (networkStore.isFujiNetwork
        ? FUJI_LIST
        : MAINNET_LIST);

      async function getTokensAndBalances() {
        const tokensWithBalancesIndex = await walletStore
          .wallet!.getBalanceERC20(Object.keys(tokenIndex))
          .then(indexTokensByAddress);

        const tokensWithBalances = Object.keys(tokenIndex).reduce(
          (acc: ERC20[], address) => {
            const listToken = tokenIndex[address];
            const balanceResult = tokensWithBalancesIndex[address];
            return [...acc, { ...listToken, ...balanceResult }];
          },
          []
        );
        setTokens(tokensWithBalances);
      }

      walletStore.wallet?.on('balanceChangedC', getTokensAndBalances);
      walletStore.newTokenAddedSignal.add(getTokensAndBalances);

      getTokensAndBalances();

      return () => {
        walletStore.wallet?.off('balanceChangedC', getTokensAndBalances);
        walletStore.newTokenAddedSignal.remove(getTokensAndBalances);
      };
    })();
  }, [networkStore.network, walletStore.wallet]);

  return tokens;
}
