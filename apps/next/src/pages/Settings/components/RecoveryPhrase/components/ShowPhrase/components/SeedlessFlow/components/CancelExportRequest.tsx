import { ActionButtons } from '@/components/ActionButtons';
import { Page } from '@/components/Page';
import { WarningMessage } from '@/components/WarningMessage';
import { useSeedlessMnemonicExport } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useFlowNavigation } from '../useFlowNavigation';

export const RequestExport = () => {
  const { t } = useTranslation();
  const { goBack, leave } = useFlowNavigation();
  const { cancelExport } = useSeedlessMnemonicExport();

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
            leave();
          },
          color: 'primary',
        }}
        bottom={{
          label: t('Cancel'),
          onClick: goBack,
          color: 'secondary',
        }}
      />
    </Page>
  );
};
