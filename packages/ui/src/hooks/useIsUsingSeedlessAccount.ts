import { AccountType, SecretType } from '@core/types';
import { useAccountsContext } from '../contexts';
import { useWalletContext } from '../contexts';

export const useIsUsingSeedlessAccount = () => {
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return (
    walletDetails?.type === SecretType.Seedless &&
    activeAccount?.type === AccountType.PRIMARY
  );
};
