import { AccountType, SecretType } from '@core/types';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useWalletContext } from '@/contexts/WalletProvider';

const useIsUsingSeedlessAccount = () => {
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    walletDetails?.type === SecretType.Seedless &&
    activeAccount?.type === AccountType.PRIMARY
  );
};

export default useIsUsingSeedlessAccount;
