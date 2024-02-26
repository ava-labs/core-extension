import { AccountType } from '@src/background/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';

const useIsUsingLedgerWallet = () => {
  const { isLedgerWallet } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return isLedgerWallet && activeAccount?.type === AccountType.PRIMARY;
};

export default useIsUsingLedgerWallet;
