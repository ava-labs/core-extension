import { AccountType } from '@core/types';
import { useAccountsContext } from '../contexts';
import { useWalletContext } from '../contexts';

export const useIsUsingLedgerWallet = () => {
  const { isLedgerWallet } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return isLedgerWallet && activeAccount?.type === AccountType.PRIMARY;
};
