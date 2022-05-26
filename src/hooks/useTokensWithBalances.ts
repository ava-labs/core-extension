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
  forceShowTokensWithoutBalances?: boolean
) {
  const { balances } = useBalancesContext();
  const { showTokensWithoutBalances } = useSettingsContext();
  const { activeAccount } = useAccountsContext();
  const { network } = useNetworkContext();

  return useMemo<TokenWithBalance[]>(() => {
    if (!network || !activeAccount) {
      return [];
    }

    const address =
      network.chainId === ChainId.BITCOIN ||
      network.chainId === ChainId.BITCOIN_TESTNET
        ? activeAccount.addressBTC
        : activeAccount.addressC;
    if (forceShowTokensWithoutBalances || showTokensWithoutBalances) {
      return balances[network?.chainId]?.[address] || [];
    }

    return (
      balances[network?.chainId]?.[address]?.filter((token) =>
        token.balance.gt(bnZero)
      ) || []
    );
  }, [
    activeAccount,
    balances,
    network,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
  ]);
}
