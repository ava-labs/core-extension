import { useMemo } from 'react';
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

const bnZero = new BN(0);

export function useTokensWithBalances(
  forceShowTokensWithoutBalances?: boolean,
  chainId?: number
) {
  const { tokens } = useBalancesContext();
  const { showTokensWithoutBalances } = useSettingsContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network } = useNetworkContext();

  const selectedChainId = chainId ? chainId : network?.chainId;

  return useMemo<TokenWithBalance[]>(() => {
    if (!selectedChainId || !activeAccount) {
      return [];
    }

    const address =
      selectedChainId === ChainId.BITCOIN ||
      selectedChainId === ChainId.BITCOIN_TESTNET
        ? activeAccount.addressBTC
        : activeAccount.addressC;
    if (forceShowTokensWithoutBalances || showTokensWithoutBalances) {
      return (
        Object.values(tokens.balances?.[selectedChainId]?.[address] ?? {}) || []
      );
    }

    const unfilteredTokens = Object.values(
      tokens.balances?.[selectedChainId]?.[address] ?? {}
    );

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

    return filteredTokens.length ? filteredTokens : defaultResult;
  }, [
    activeAccount,
    tokens,
    selectedChainId,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
  ]);
}
