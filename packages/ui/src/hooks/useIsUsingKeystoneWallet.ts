import { AccountType } from '@core/service-worker';
import { SecretType } from '@core/service-worker';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';

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
