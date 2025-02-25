import { AccountType } from '@src/background/services/accounts/models';
import { SecretType } from '@src/background/services/secrets/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';

const useIsUsingKeystone3Wallet = () => {
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    walletDetails?.type === SecretType.Keystone3Pro &&
    activeAccount?.type === AccountType.PRIMARY
  );
};

export default useIsUsingKeystone3Wallet;
