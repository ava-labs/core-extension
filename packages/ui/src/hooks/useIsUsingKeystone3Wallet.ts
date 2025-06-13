import { AccountType, SecretType } from '@core/types';
import { useAccountsContext, useWalletContext } from '../contexts';

export const useIsUsingKeystone3Wallet = () => {
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    walletDetails?.type === SecretType.Keystone3Pro &&
    activeAccount?.type === AccountType.PRIMARY
  );
};
