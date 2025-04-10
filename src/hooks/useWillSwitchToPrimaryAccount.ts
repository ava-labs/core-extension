import { AccountType } from 'packages/service-worker/src/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { isProductionBuild } from '@src/utils/environment';

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
