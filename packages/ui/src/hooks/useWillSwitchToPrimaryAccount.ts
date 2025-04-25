import { AccountType } from '@core/service-worker';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { isProductionBuild } from '@core/utils';

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
