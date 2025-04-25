import { AccountType } from '@core/types';
import { useAccountsContext } from '@/contexts/AccountsProvider';

const useIsUsingWalletConnectAccount = () => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return activeAccount?.type === AccountType.WALLET_CONNECT;
};

export default useIsUsingWalletConnectAccount;
