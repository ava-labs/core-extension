import { AccountType } from '@src/background/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

const useIsUsingFireblocksAccount = () => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return activeAccount?.type === AccountType.FIREBLOCKS;
};

export default useIsUsingFireblocksAccount;
