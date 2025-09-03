import { useTranslation } from 'react-i18next';
import { Confirmation } from './Confirmation';

type RpcUrlResetConfirmationProps = {
  onBack: () => void;
  onSubmit: () => void;
};

export const RpcUrlResetConfirmation = ({
  onBack,
  onSubmit,
}: RpcUrlResetConfirmationProps) => {
  const { t } = useTranslation();

  return (
    <Confirmation
      onBack={onBack}
      onSubmit={onSubmit}
      title={t('Are you sure you want to reset the RPC URL?')}
      warningText={t(
        'Resetting the RPC URL will set it back to its default URL',
      )}
      primaryButtonText={t('Save')}
      secondaryButtonText={t('Cancel')}
    />
  );
};
