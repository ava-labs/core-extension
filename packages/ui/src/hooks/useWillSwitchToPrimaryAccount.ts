import { AccountType } from '@core/types';
import { useAccountsContext } from '../contexts';
import { isProductionBuild } from '@core/common';

export function useWillSwitchToPrimaryAccount(
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
