import { AccountType } from '@core/service-worker';
import { useAccountsContext } from '@/contexts/AccountsProvider';

const useIsUsingFireblocksAccount = () => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return activeAccount?.type === AccountType.FIREBLOCKS;
};

export default useIsUsingFireblocksAccount;
