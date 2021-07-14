import { useStore } from '@src/store/store';
import { useEffect, useState } from 'react';

const FUJI_LIST =
  'https://raw.githubusercontent.com/dasconnor/tokenlist/main/fuji.tokenlist.json';
const MAINNET_LIST =
  'https://raw.githubusercontent.com/pangolindex/tokenlists/main/top15.tokenlist.json';

export function useGetErc20Tokens() {
  const [tokens, setTokens] = useState<any[]>();
  const { walletStore, networkStore } = useStore();

  useEffect(() => {
    (async function () {
      const { tokens }: { tokens: any[] } = await (
        await fetch(networkStore.isFujiNetwork ? FUJI_LIST : MAINNET_LIST)
      ).json();

      const tokensWithBalances = await Promise.all(
        tokens.map(async (token) => {
          const result = await walletStore.wallet!.getBalanceERC20(
            token.address
          );
          return { ...token, ...result };
        })
      );

      setTokens(tokensWithBalances);
    })();
  }, [networkStore.network]);

  return tokens;
}
