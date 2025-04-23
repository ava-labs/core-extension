import { AccountType } from '@core/service-worker';
import { SecretType } from '@core/service-worker';
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
