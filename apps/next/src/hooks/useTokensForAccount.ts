import {
  NetworkVMType,
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import { orderBy } from 'lodash';

import { getAllAddressesForAccount } from '@core/common';
import {
  Account,
  FungibleAssetType,
  FungibleTokenBalance,
  NetworkWithCaipId,
} from '@core/types';
import { useBalancesContext, useNetworkContext } from '@core/ui';
import { useMemo } from 'react';

type UseTokensForAccountOptions = {
  // If set to true, malicious tokens will not be listed.
  hideMalicious?: boolean;
  // If omitted, all networks will be used.
  networks?: NetworkWithCaipId[];
};

const DEFAULT_OPTIONS: UseTokensForAccountOptions = {
  hideMalicious: true,
  networks: [],
};

export const useTokensForAccount = (
  account?: Account,
  options: UseTokensForAccountOptions = DEFAULT_OPTIONS,
) => {
  const {
    balances: { tokens: tokensByChain },
  } = useBalancesContext();
  const { getNetwork } = useNetworkContext();

  return useMemo(() => {
    if (!account) {
      return [];
    }

    const tokens: FungibleTokenBalance[] = [];
    const addresses = getAllAddressesForAccount(account);

    for (const [coreChainId, chainBalances] of Object.entries(
      tokensByChain ?? {},
    )) {
      if (!isChainIdRequested(coreChainId, options.networks ?? [])) {
        continue;
      }

      const network = getNetwork(Number(coreChainId));

      if (!network) {
        // If we don't know the network for the token, we can't use it anyway.
        continue;
      }

      for (const [address, addressBalances] of Object.entries(
        chainBalances ?? {},
      )) {
        if (!addresses.includes(address)) {
          continue;
        }

        const nonMaliciousTokens = Object.values(addressBalances)
          .filter(options.hideMalicious ? isNotKnownMalicious : () => true)
          .filter(isFungibleToken);

        for (const balance of nonMaliciousTokens) {
          tokens.push(decorateWithAssetTypeAndChainId(balance, network));
        }
      }
    }

    return sortTokens(tokens);
  }, [
    account,
    tokensByChain,
    getNetwork,
    options.networks,
    options.hideMalicious,
  ]);
};

const isChainIdRequested = (chainId: string, networks: NetworkWithCaipId[]) => {
  return (
    networks.length === 0 ||
    networks.some((network) => network.chainId === Number(chainId))
  );
};

const decorateWithAssetTypeAndChainId = (
  token: Exclude<TokenWithBalance, NftTokenWithBalance>,
  network: NetworkWithCaipId,
): FungibleTokenBalance => ({
  ...token,
  assetType: getFungibleAssetType(token, network),
  coreChainId: network.chainId,
});

const getFungibleAssetType = (
  token: TokenWithBalance,
  network: NetworkWithCaipId,
): FungibleAssetType => {
  switch (network.vmName) {
    case NetworkVMType.EVM:
      return token.type === TokenType.NATIVE ? 'evm_native' : 'evm_erc20';
    case NetworkVMType.PVM:
      return 'pvm_native';
    case NetworkVMType.AVM:
      return 'avm_native';
    case NetworkVMType.SVM:
      return token.type === TokenType.NATIVE ? 'svm_native' : 'svm_spl';
    case NetworkVMType.BITCOIN:
      return 'btc_native';
    default:
      return 'unknown';
  }
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

const isAvaxToken = (
  token: FungibleTokenBalance,
): token is FungibleTokenBalance & { type: TokenType.NATIVE } =>
  token.type === TokenType.NATIVE && token.symbol === 'AVAX';

/**
 * Native tokens first, then tokens sorted by balance in currency, then tokens sorted by balance, then tokens sorted by symbol
 */
const sortTokens = (tokens: FungibleTokenBalance[]): FungibleTokenBalance[] =>
  orderBy(
    tokens,
    [
      isAvaxToken,
      isNativeToken,
      hasCurrencyValue,
      'token.balanceInCurrency',
      'token.balance',
      'token.name',
    ],
    ['desc', 'desc', 'desc', 'desc', 'desc', 'asc'], // isNativeToken and hasCurrencyValue return booleans and true > false (1 > 0)
  );
