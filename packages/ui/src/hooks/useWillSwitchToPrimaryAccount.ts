import { AccountType } from '@core/types';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { isProductionBuild } from '@core/common';

export default function useWillSwitchToPrimaryAccount(
  isSwitchingToTestnetMode: boolean,
) {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const isFireblocksAccount = activeAccount?.type === AccountType.FIREBLOCKS;

  return Boolean(
    isProductionBuild() && isSwitchingToTestnetMode && isFireblocksAccount,
  );
}
