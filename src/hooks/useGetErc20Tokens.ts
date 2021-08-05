import { useEffect, useState } from 'react';
import { Network, WalletType } from '@avalabs/avalanche-wallet-sdk';
import { ActiveNetwork } from '@src/contexts/NetworkProvider';
import { ERC20 } from '@src/pages/Send/models';

/**
 * Helper function to index contracts by address
 */
function indexTokensByAddress(tokens: ERC20[]) {
  return tokens.reduce<{ [key: string]: ERC20 }>((acc, token) => {
    return {
      ...acc,
      [token.address.toLocaleLowerCase()]: token,
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
    const listToken = tokenIndex[address.toLowerCase()];
    const balanceResult = tokensWithBalancesIndex[address.toLowerCase()];
    return [...acc, { ...listToken, ...balanceResult }];
  }, []);
}

/**
 *
 * @returns ERC20 token list with balances
 */
export function useGetErc20Tokens(
  wallet?: WalletType,
  network?: ActiveNetwork
) {
  const [tokens, setTokens] = useState<ERC20[]>();

  useEffect(() => {
    async function getTokensAndBalances() {
      if (!wallet || !network) {
        return;
      }
      const tokenIndex = await (Network.isFujiNetwork(network.config)
        ? FUJI_LIST
        : MAINNET_LIST);
      const tokensWithBalances = await combineTokensAndBalances(
        wallet,
        tokenIndex
      );
      tokensWithBalances && setTokens(tokensWithBalances);
    }
    /**
     * Call first time so it loads the list
     */
    getTokensAndBalances();
    /**
     * We want to watch for changes to the C chain balance and
     * for custom tokens added. In either case we want to update the tokens in the UI
     */
    wallet?.on('balanceChangedC', getTokensAndBalances);
    // newTokenAddedSignal.add(getTokensAndBalances);

    return () => {
      wallet?.off('balanceChangedC', getTokensAndBalances);
      // newTokenAddedSignal.remove(getTokensAndBalances);
    };
  }, [network, wallet]);

  return tokens;
}
