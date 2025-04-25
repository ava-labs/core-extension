import { AccountType } from '@core/service-worker';
import { SecretType } from '@core/service-worker';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useWalletContext } from '@/contexts/WalletProvider';

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
