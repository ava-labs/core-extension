import { useAccountsContext } from '../contexts';
import { useWalletContext } from '../contexts';
import { AccountType, SecretType } from '@core/types';

export const useIsUsingKeystoneWallet = () => {
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    walletDetails?.type === SecretType.Keystone &&
    activeAccount?.type === AccountType.PRIMARY
  );
};
