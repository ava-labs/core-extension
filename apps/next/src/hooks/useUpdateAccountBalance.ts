import { useEffect } from 'react';
import { NetworkWithCaipId } from '@core/types';
import { useAccountsContext, useBalancesContext } from '@core/ui';

export const useUpdateAccountBalance = (network: NetworkWithCaipId) => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const { updateBalanceOnNetworks } = useBalancesContext();

  useEffect(() => {
    if (!activeAccount) {
      return;
    }

    updateBalanceOnNetworks([activeAccount], [network.chainId]);
  }, [activeAccount, network.chainId, updateBalanceOnNetworks]);
};
