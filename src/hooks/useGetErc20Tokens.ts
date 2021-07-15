import { useStore } from '@src/store/store';
import { ERC20 } from '@src/store/wallet/types';
import { useEffect, useState } from 'react';
import { WalletType } from '../../../avalanche-wallet-sdk-internal/dist/Wallet/types';

/**
 * Helper function to index contracts by address
 */
function indexTokensByAddress(tokens: ERC20[]) {
  return tokens.reduce<{ [key: string]: ERC20 }>((acc, token) => {
    return {
      ...acc,
      [token.address]: token,
    };
  }, {});
}

/**
 * Cache the indexed tokens in a promise right away so we arent having to make this call several times
 */
const FUJI_LIST = fetch(
  'https://raw.githubusercontent.com/dasconnor/tokenlist/main/fuji.tokenlist.json'
)
  .then((response) => response.json())
  .then((res) => res.tokens)
  .then(indexTokensByAddress);

/**
 * Cache the indexed tokens in a promise right away so we arent having to make this call several times
 */
const MAINNET_LIST = fetch(
  'https://raw.githubusercontent.com/pangolindex/tokenlists/main/top15.tokenlist.json'
)
  .then((response) => response.json())
  .then((res) => res.tokens)
  .then(indexTokensByAddress);

/**
 * Index the contract tokens, by address, when balances are returned. Then combine them
 * with the master list for the environment. This gaurantees that the master list is for the
 * environment is represented and we dont have duplicates'
 *
 * @param wallet  the current wallet
 * @param tokenIndex the master list of environment tokens
 * @returns the combination of the two lists
 */
async function combineTokensAndBalances(
  wallet?: WalletType,
  tokenIndex?: ReturnType<typeof indexTokensByAddress>
) {
  if (!wallet || !tokenIndex) {
    return;
  }

  const tokensWithBalancesIndex = await wallet
    .getBalanceERC20(Object.keys(tokenIndex))
    .then(indexTokensByAddress);

  return Object.keys(tokenIndex).reduce((acc: ERC20[], address) => {
    const listToken = tokenIndex[address];
    const balanceResult = tokensWithBalancesIndex[address];
    return [...acc, { ...listToken, ...balanceResult }];
  }, []);
}

/**
 *
 * @returns ERC20 token list with balances
 */
export function useGetErc20Tokens() {
  const [tokens, setTokens] = useState<ERC20[]>();
  const { walletStore, networkStore } = useStore();

  useEffect(() => {
    async function getTokensAndBalances() {
      const tokenIndex = await (networkStore.isFujiNetwork
        ? FUJI_LIST
        : MAINNET_LIST);
      const tokensWithBalances = await combineTokensAndBalances(
        walletStore.wallet,
        tokenIndex
      );
      tokensWithBalances && setTokens(tokensWithBalances);
    }
    /**
     * We want to watch for changes to the C chain balance and
     * for custom tokens added. In either case we want to update the tokens in the UI
     */
    walletStore.wallet?.on('balanceChangedC', getTokensAndBalances);
    walletStore.newTokenAddedSignal.add(getTokensAndBalances);

    return () => {
      walletStore.wallet?.off('balanceChangedC', getTokensAndBalances);
      walletStore.newTokenAddedSignal.remove(getTokensAndBalances);
    };
  }, [networkStore.network, walletStore.wallet]);

  return tokens;
}
