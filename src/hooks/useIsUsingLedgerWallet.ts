import { AccountType } from '@src/background/services/accounts/models';
import { WalletType } from '@src/background/services/wallet/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';

const useIsUsingLedgerWallet = () => {
  const { walletType } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    walletType === WalletType.LEDGER &&
    activeAccount?.type === AccountType.PRIMARY
  );
};

export default useIsUsingLedgerWallet;
