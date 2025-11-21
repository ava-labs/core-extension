import { toast } from '@avalabs/k2-alpine';
import { WalletDetails } from '@core/types';
import { useWalletContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { RenameForm } from './Form';

type Props = {
  wallet: WalletDetails;
};

export const RenameWalletForm: FC<Props> = ({ wallet }) => {
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const { renameWallet } = useWalletContext();

  const onSave = (newName: string) => {
    renameWallet(wallet.id, newName)
      .then(() => {
        goBack();
        toast.success(t('Wallet renamed'));
      })
      .catch(() => {
        toast.error(t('Failed to rename the wallet. Try again.'));
      });
  };

  return <RenameForm name={wallet.name!} onSave={onSave} onCancel={goBack} />;
};
