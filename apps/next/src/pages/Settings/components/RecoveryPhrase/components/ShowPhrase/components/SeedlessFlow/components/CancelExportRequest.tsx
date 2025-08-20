import { ActionButtons } from '@/components/ActionButtons';
import { Page } from '@/components/Page';
import { WarningMessage } from '@/components/WarningMessage';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { StageProps } from '../types';

export const RequestExport: FC<StageProps> = ({ cancelExport }) => {
  const { t } = useTranslation();
  const { push } = useHistory();

  const goToSettings = () => {
    push('/settings');
  };

  return (
    <Page
      title={t('Are you sure that you want to cancel this request?')}
      contentProps={{
        justifyContent: undefined,
      }}
    >
      <WarningMessage>
        {t('Canceling will require you to restart the 2 day waiting period  ')}
      </WarningMessage>

      <ActionButtons
        top={{
          label: t('Approve'),
          onClick: () => {
            cancelExport();
            goToSettings();
          },
          color: 'primary',
        }}
        bottom={{
          label: t('Cancel'),
          onClick: goToSettings,
          color: 'secondary',
        }}
      />
    </Page>
  );
};
