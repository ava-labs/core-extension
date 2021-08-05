import { Network, WalletType } from '@avalabs/avalanche-wallet-sdk';
import { ERC20 } from './models';

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
export const FUJI_LIST = fetch(
  'https://raw.githubusercontent.com/dasconnor/tokenlist/main/fuji.tokenlist.json'
)
  .then((response) => response.json())
  .then((res) => res.tokens)
  .then(indexTokensByAddress);

/**
 * Cache the indexed tokens in a promise right away so we arent having to make this call several times
 */
export const MAINNET_LIST = fetch(
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
export async function combineTokensAndBalances(
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
