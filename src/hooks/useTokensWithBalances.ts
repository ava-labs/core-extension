import { useEffect, useMemo, useState } from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { ChainId } from '@avalabs/chains-sdk';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { BN } from 'bn.js';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { GetTokensListHandler } from '@src/background/services/tokens/handlers/getTokenList';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

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

        const zeroBalance = new BN(0);
        const tokensWithPlaceholderBalances = Object.entries(
          networkTokens.tokens
        ).reduce<{
          [address: string]: TokenWithBalance;
        }>((tokensWithBalances, [address, tokenData]) => {
          tokensWithBalances[address] = {
            ...tokenData,
            type: TokenType.ERC20,
            balance: zeroBalance,
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

    const address =
      selectedChainId === ChainId.BITCOIN ||
      selectedChainId === ChainId.BITCOIN_TESTNET
        ? activeAccount.addressBTC
        : activeAccount.addressC;

    const nonZeroBalances =
      Object.values(tokens.balances?.[selectedChainId]?.[address] ?? {}) || [];

    if (forceShowTokensWithoutBalances || showTokensWithoutBalances) {
      return [
        ...Object.values(allTokensWithPlaceholderBalances),
        ...nonZeroBalances,
      ];
    }

    return nonZeroBalances;
  }, [
    selectedChainId,
    activeAccount,
    tokens.balances,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
    allTokensWithPlaceholderBalances,
  ]);
}
