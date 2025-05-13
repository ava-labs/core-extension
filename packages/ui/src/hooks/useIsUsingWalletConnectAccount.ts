import { AccountType } from '@core/types';
import { useAccountsContext } from '../contexts';

export const useIsUsingWalletConnectAccount = () => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return activeAccount?.type === AccountType.WALLET_CONNECT;
};
