import { useTranslation } from 'react-i18next';
import { Confirmation } from './Confirmation';

type NetworkUpdateConfirmationProps = {
  onBack: () => void;
  onSubmit: () => void;
};

export const NetworkUpdateConfirmation = ({
  onBack,
  onSubmit,
}: NetworkUpdateConfirmationProps) => {
  const { t } = useTranslation();

  return (
    <Confirmation
      onBack={onBack}
      onSubmit={onSubmit}
      title={t('Do you really want to save?')}
      warningText={t('Core functionality may be unstable with custom RPC URLs')}
      primaryButtonText={t('Save')}
      secondaryButtonText={t('Cancel')}
    />
  );
};
