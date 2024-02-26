import { AccountType } from '@src/background/services/accounts/models';
import { SecretType } from '@src/background/services/secrets/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';

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
