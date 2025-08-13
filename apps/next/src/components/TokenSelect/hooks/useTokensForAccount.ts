import { orderBy } from 'lodash';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';

import { useBalancesContext } from '@core/ui';
import { getAllAddressesForAccount } from '@core/common';
import { Account, FungibleTokenBalance } from '@core/types';

export const useTokensForAccount = (account?: Account) => {
  const {
    balances: { tokens: tokensByChain },
  } = useBalancesContext();

  if (!account) {
    return [];
  }

  const tokens: FungibleTokenBalance[] = [];
  const addresses = getAllAddressesForAccount(account);

  for (const [coreChainId, chainBalances] of Object.entries(
    tokensByChain ?? {},
  )) {
    for (const [address, addressBalances] of Object.entries(
      chainBalances ?? {},
    )) {
      if (!addresses.includes(address)) {
        continue;
      }

      const nonMaliciousTokens = Object.values(addressBalances)
        .filter(isNotKnownMalicious)
        .filter(isFungibleToken);

      tokens.push(
        ...nonMaliciousTokens.map((balance) => ({
          ...balance,
          coreChainId: Number(coreChainId),
        })),
      );
    }
  }

  return sortTokens(tokens);
};

const isFungibleToken = (
  balance: TokenWithBalance,
): balance is FungibleTokenBalance =>
  balance.type !== TokenType.ERC721 && balance.type !== TokenType.ERC1155;

const isNotKnownMalicious = (balance: TokenWithBalance) =>
  balance.type !== TokenType.ERC20 || balance.reputation !== 'Malicious';

const hasCurrencyValue = (
  token: FungibleTokenBalance,
): token is FungibleTokenBalance & { balanceInCurrency: number } =>
  typeof token.balanceInCurrency === 'number';

const isNativeToken = (
  token: FungibleTokenBalance,
): token is FungibleTokenBalance & { type: TokenType.NATIVE } =>
  token.type === TokenType.NATIVE;

/**
 * Native tokens first, then tokens sorted by balance in currency, then tokens sorted by balance, then tokens sorted by symbol
 */
const sortTokens = (tokens: FungibleTokenBalance[]): FungibleTokenBalance[] =>
  orderBy(
    tokens,
    [
      isNativeToken,
      hasCurrencyValue,
      'token.balanceInCurrency',
      'token.balance',
      'token.name',
    ],
    ['desc', 'desc', 'desc', 'desc', 'asc'], // isNativeToken and hasCurrencyValue return booleans and true > false (1 > 0)
  );
