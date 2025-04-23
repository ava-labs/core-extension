import { AccountType } from '@core/service-worker';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

const useIsUsingWalletConnectAccount = () => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return activeAccount?.type === AccountType.WALLET_CONNECT;
};

export default useIsUsingWalletConnectAccount;
