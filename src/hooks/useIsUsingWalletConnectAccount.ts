import { AccountType } from 'packages/service-worker/src/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

const useIsUsingWalletConnectAccount = () => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return activeAccount?.type === AccountType.WALLET_CONNECT;
};

export default useIsUsingWalletConnectAccount;
