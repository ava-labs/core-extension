import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useWalletContext } from '@/contexts/WalletProvider';
import { AccountType, SecretType } from '@core/types';

const useIsUsingKeystoneWallet = () => {
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    walletDetails?.type === SecretType.Keystone &&
    activeAccount?.type === AccountType.PRIMARY
  );
};

export default useIsUsingKeystoneWallet;
