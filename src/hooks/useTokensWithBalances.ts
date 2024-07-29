import { useEffect, useMemo, useState } from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { BN } from 'bn.js';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { GetTokensListHandler } from '@src/background/services/tokens/handlers/getTokenList';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { merge } from 'lodash';
import { getAddressForChain } from '@src/utils/getAddressForChain';

type UseTokensWithBalanceOptions = {
  // Requests the tokens WITH and WITHOUT balances
  forceShowTokensWithoutBalances?: boolean;
  // string array of asset symbols that are to be excluded from the result
  disallowedAssets?: string[];
  chainId?: number;
};

const bnZero = new BN(0);

const nativeTokensFirst = (tokens: TokenWithBalance[]): TokenWithBalance[] =>
  [...tokens].sort((t) => (t.type === TokenType.NATIVE ? -1 : 1));

const DISALLOWED_ASSETS = [];

/**
 *
 * @param {UseTokensWithBalanceOptions} options
 * @returns Tokens list with OR without balances based on `forceShowTokensWithoutBalances`
 */
export const useTokensWithBalances = (
  options: UseTokensWithBalanceOptions = {}
) => {
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(
    undefined
  );
  const [
    allTokensWithPlaceholderBalances,
    setAllTokensWithPlaceholderBalances,
  ] = useState<{
    [address: string]: TokenWithBalance;
  }>({});

  const { request } = useConnectionContext();
  const { tokens } = useBalancesContext();
  const { showTokensWithoutBalances, customTokens } = useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network } = useNetworkContext();
  const {
    forceShowTokensWithoutBalances = false,
    disallowedAssets = DISALLOWED_ASSETS,
    chainId = undefined,
  } = options;

  const customTokensWithZeroBalance: {
    [address: string]: TokenWithBalance;
  } = useMemo(() => {
    if (!network?.chainId) {
      return {};
    }
    const customTokenForActiveNetwork = customTokens[network?.chainId];
    if (!customTokenForActiveNetwork) {
      return {};
    }

    return Object.entries(customTokenForActiveNetwork).reduce<{
      [address: string]: TokenWithBalance;
    }>((acc, [address, tokenData]) => {
      acc[address] = {
        ...tokenData,
        type: TokenType.ERC20,
        balance: bnZero,
      };

      return acc;
    }, {});
  }, [customTokens, network?.chainId]);

  useEffect(() => {
    setSelectedChainId(chainId ? chainId : network?.chainId);
  }, [chainId, network?.chainId]);

  useEffect(() => {
    const getNetworkTokens = async () => {
      if (!selectedChainId) {
        setAllTokensWithPlaceholderBalances({});
        return;
      }

      try {
        const networkTokens = await request<GetTokensListHandler>({
          method: ExtensionRequest.GET_NETWORK_TOKENS,
          params: [selectedChainId, disallowedAssets],
        });

        const tokensWithPlaceholderBalances = Object.entries(
          networkTokens.tokens
        ).reduce<{
          [address: string]: TokenWithBalance;
        }>((tokensWithBalances, [address, tokenData]) => {
          tokensWithBalances[address.toLowerCase()] = {
            ...tokenData,
            type: TokenType.ERC20,
            balance: bnZero,
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
    selectedChainId,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
    customTokensWithZeroBalance,
    disallowedAssets,
  ]);

  return useMemo<TokenWithBalance[]>(() => {
    if (!selectedChainId || !activeAccount) {
      return [];
    }

    const address = getAddressForChain(selectedChainId, activeAccount);

    if (!address) {
      return [];
    }

    const networkBalances = tokens.balances?.[selectedChainId]?.[address] ?? {};

    if (forceShowTokensWithoutBalances || showTokensWithoutBalances) {
      const merged = merge(
        {},
        allTokensWithPlaceholderBalances,
        networkBalances
      );

      return nativeTokensFirst(Object.values(merged));
    }

    const unfilteredTokens = Object.values(networkBalances);

    if (!unfilteredTokens) {
      return [];
    }

    const nativeToken = unfilteredTokens.find(
      (token) => token.type === TokenType.NATIVE
    );

    const defaultResult = nativeToken ? [nativeToken] : [];

    const filteredTokens = unfilteredTokens.filter((token) => {
      return token.balance.gt(bnZero) || token.type === TokenType.NATIVE; // Always include the native token
    });

    return filteredTokens.length
      ? nativeTokensFirst(filteredTokens)
      : defaultResult;
  }, [
    selectedChainId,
    activeAccount,
    tokens.balances,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
    allTokensWithPlaceholderBalances,
  ]);
};
