import { AccountType } from '@core/service-worker';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useWalletContext } from '@/contexts/WalletProvider';

const useIsUsingLedgerWallet = () => {
  const { isLedgerWallet } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return isLedgerWallet && activeAccount?.type === AccountType.PRIMARY;
};

export default useIsUsingLedgerWallet;
