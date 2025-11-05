import { useAccountsContext } from '../contexts';
import { useBalancesContext } from '../contexts';
import { useConnectionContext } from '../contexts';
import { useNetworkContext } from '../contexts';
import { useSettingsContext } from '../contexts';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { GetTokensListHandler } from '@core/service-worker';
import { ExtensionRequest, NetworkWithCaipId } from '@core/types';
import { getAddressForChain, lowerCaseKeys } from '@core/common';
import { merge } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

type UseTokensWithBalanceOptions = {
  // Requests the tokens WITH and WITHOUT balances
  forceShowTokensWithoutBalances?: boolean;
  forceHiddenTokens?: boolean;
  // string array of asset symbols that are to be excluded from the result
  disallowedAssets?: string[];
  network?: NetworkWithCaipId;
};

const nativeTokensFirst = (tokens: TokenWithBalance[]): TokenWithBalance[] =>
  [...tokens].sort((t) => (t.type === TokenType.NATIVE ? -1 : 1));

const DISALLOWED_ASSETS = [];

/**
 *
 * @param {UseTokensWithBalanceOptions} options
 * @returns Tokens list with OR without balances based on `forceShowTokensWithoutBalances`
 */
export const useTokensWithBalances = (
  options: UseTokensWithBalanceOptions = {},
) => {
  const [
    allTokensWithPlaceholderBalances,
    setAllTokensWithPlaceholderBalances,
  ] = useState<{
    [address: string]: TokenWithBalance;
  }>({});

  const { request } = useConnectionContext();
  const { balances } = useBalancesContext();
  const { showTokensWithoutBalances, customTokens, getTokenVisibility } =
    useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network: activeNetwork } = useNetworkContext();
  const {
    forceShowTokensWithoutBalances = false,
    disallowedAssets = DISALLOWED_ASSETS,
    network,
  } = options;

  const customTokensWithZeroBalance: {
    [address: string]: TokenWithBalance;
  } = useMemo(() => {
    if (!activeNetwork?.chainId) {
      return {};
    }
    const customTokensForActiveNetwork = customTokens?.[activeNetwork.chainId];
    if (!customTokensForActiveNetwork) {
      return {};
    }

    return Object.entries(customTokensForActiveNetwork).reduce<{
      [address: string]: TokenWithBalance;
    }>((acc, [address, tokenData]) => {
      acc[address] = {
        ...tokenData,
        type: TokenType.ERC20,
        balance: 0n,
        balanceDisplayValue: '0',
        reputation: null,
      };

      return acc;
    }, {});
  }, [activeNetwork?.chainId, customTokens]);

  const visibleTokens = useCallback(
    (tokens: TokenWithBalance[]) => {
      if (options.forceHiddenTokens) {
        return tokens;
      }

      return tokens.filter((token) =>
        getTokenVisibility(token, activeNetwork?.caipId),
      );
    },
    [getTokenVisibility, options.forceHiddenTokens, activeNetwork?.caipId],
  );

  const selectedNetwork = useMemo(
    () => network ?? activeNetwork,
    [network, activeNetwork],
  );

  useEffect(() => {
    const getNetworkTokens = async () => {
      if (!selectedNetwork?.chainId) {
        setAllTokensWithPlaceholderBalances({});
        return;
      }

      try {
        const networkTokens = await request<GetTokensListHandler>({
          method: ExtensionRequest.GET_NETWORK_TOKENS,
          params: [selectedNetwork.chainId, disallowedAssets],
        });

        const tokensWithPlaceholderBalances = Object.entries(
          networkTokens.tokens,
        ).reduce<{
          [address: string]: TokenWithBalance;
        }>((tokensWithBalances, [address, tokenData]) => {
          tokensWithBalances[address.toLowerCase()] = {
            ...tokenData,
            type:
              tokenData.contractType === 'SPL'
                ? TokenType.SPL
                : TokenType.ERC20,
            balance: 0n,
            balanceDisplayValue: '0',
            reputation: null,
          };

          return tokensWithBalances;
        }, {});

        setAllTokensWithPlaceholderBalances({
          ...customTokensWithZeroBalance,
          ...tokensWithPlaceholderBalances,
        });
      } catch (err) {
        console.error(err);
        setAllTokensWithPlaceholderBalances({});
      }
    };

    if (forceShowTokensWithoutBalances || showTokensWithoutBalances) {
      getNetworkTokens();
      return;
    }

    setAllTokensWithPlaceholderBalances({});
  }, [
    request,
    selectedNetwork?.chainId,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
    customTokensWithZeroBalance,
    disallowedAssets,
  ]);

  return useMemo<TokenWithBalance[]>(() => {
    if (!selectedNetwork?.chainId || !activeAccount) {
      return [];
    }

    const address = getAddressForChain(selectedNetwork, activeAccount);

    if (!address) {
      return [];
    }

    const networkBalances =
      balances.tokens?.[selectedNetwork?.chainId]?.[address] ?? {};

    if (forceShowTokensWithoutBalances || showTokensWithoutBalances) {
      const merged = merge(
        {},
        lowerCaseKeys(allTokensWithPlaceholderBalances),
        lowerCaseKeys(networkBalances),
      );

      return visibleTokens(nativeTokensFirst(Object.values(merged)));
    }

    const unfilteredTokens = Object.values(networkBalances);

    if (!unfilteredTokens) {
      return [];
    }

    const nativeToken = unfilteredTokens.find(
      (token) => token.type === TokenType.NATIVE,
    );

    const defaultResult = nativeToken ? [nativeToken] : [];

    const filteredTokens = unfilteredTokens.filter((token) => {
      return token.type === TokenType.NATIVE || token.balance > 0n;
    });

    return visibleTokens(
      filteredTokens.length ? nativeTokensFirst(filteredTokens) : defaultResult,
    );
  }, [
    selectedNetwork,
    activeAccount,
    balances.tokens,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
    allTokensWithPlaceholderBalances,
    visibleTokens,
  ]);
};
