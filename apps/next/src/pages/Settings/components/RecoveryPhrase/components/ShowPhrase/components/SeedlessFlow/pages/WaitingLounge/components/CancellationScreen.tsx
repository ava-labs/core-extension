import { ActionButtons } from '@/components/ActionButtons';
import { WarningMessage } from '@/components/WarningMessage';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onApprove: () => void;
  onCancel: () => void;
};

export const CancellationScreen: FC<Props> = ({ onApprove, onCancel }) => {
  const { t } = useTranslation();

  return (
    <>
      <WarningMessage>
        {t('Cancelling will require you to restart the 2 day waiting period')}
      </WarningMessage>
      <ActionButtons
        top={{
          label: t('Approve'),
          onClick: onApprove,
        }}
        bottom={{
          label: t('Cancel'),
          onClick: onCancel,
        }}
      />
    </>
  );
};
