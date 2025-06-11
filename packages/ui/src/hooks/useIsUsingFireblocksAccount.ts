import { AccountType } from '@core/types';
import { useAccountsContext } from '../contexts';

export const useIsUsingFireblocksAccount = () => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return activeAccount?.type === AccountType.FIREBLOCKS;
};
