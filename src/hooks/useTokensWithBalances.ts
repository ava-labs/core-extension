import { useMemo } from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { ChainId } from '@avalabs/chains-sdk';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { BN } from 'bn.js';

const bnZero = new BN(0);

export function useTokensWithBalances(
  forceShowTokensWithoutBalances?: boolean,
  chainId?: number
) {
  const { tokens } = useBalancesContext();
  const { showTokensWithoutBalances } = useSettingsContext();
  const { activeAccount } = useAccountsContext();
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
      return tokens.balances?.[selectedChainId]?.[address] || [];
    }

    return (
      tokens.balances?.[selectedChainId]?.[address]?.filter((token) =>
        token.balance.gt(bnZero)
      ) || []
    );
  }, [
    activeAccount,
    tokens,
    selectedChainId,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
  ]);
}
