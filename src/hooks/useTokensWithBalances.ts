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
import { isBitcoinChainId } from '@src/background/services/network/utils/isBitcoinNetwork';
import { isPchainNetworkId } from '@src/background/services/network/utils/isAvalanchePchainNetwork';

const bnZero = new BN(0);

const nativeTokensFirst = (tokens: TokenWithBalance[]): TokenWithBalance[] =>
  [...tokens].sort((t) => (t.type === TokenType.NATIVE ? -1 : 1));

export function useTokensWithBalances(
  forceShowTokensWithoutBalances?: boolean,
  chainId?: number
) {
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
  const { showTokensWithoutBalances } = useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network } = useNetworkContext();

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
          params: [selectedChainId],
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

        setAllTokensWithPlaceholderBalances(tokensWithPlaceholderBalances);
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
  ]);

  return useMemo<TokenWithBalance[]>(() => {
    if (!selectedChainId || !activeAccount) {
      return [];
    }

    const address = isBitcoinChainId(selectedChainId)
      ? activeAccount.addressBTC
      : isPchainNetworkId(selectedChainId)
      ? activeAccount.addressPVM
      : activeAccount.addressC;

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
      return token.balance.gt(bnZero);
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
}
