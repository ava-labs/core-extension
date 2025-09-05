import { useTranslation } from 'react-i18next';
import { Confirmation } from './Confirmation';

type NetworkDeleteConfirmationProps = {
  onBack: () => void;
  onSubmit: () => void;
};

export const NetworkDeleteConfirmation = ({
  onBack,
  onSubmit,
}: NetworkDeleteConfirmationProps) => {
  const { t } = useTranslation();

  return (
    <Confirmation
      onBack={onBack}
      onSubmit={onSubmit}
      title={t('Are you sure you want to delete this network?')}
      warningText={t('This action can’t be undone')}
      primaryButtonText={t('Delete')}
      secondaryButtonText={t('Cancel')}
    />
  );
};
