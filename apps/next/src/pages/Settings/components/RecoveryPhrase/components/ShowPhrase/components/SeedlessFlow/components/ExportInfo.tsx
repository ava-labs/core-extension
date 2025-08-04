import { ActionButtons } from '@/components/ActionButtons';
import { Page } from '@/components/Page';
import { WarningMessage } from '@/components/WarningMessage';
import { StackProps } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useFlowNavigation } from '../useFlowNavigation';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const ExportInfo = () => {
  const { t } = useTranslation();
  const { navigateToNextStage, leave } = useFlowNavigation();
  return (
    <Page
      title={t('There is a waiting period to view your recovery phrase')}
      description={t(
        'This phrase is your access key to your wallet. Carefully write it down and store it in a safe location',
      )}
      contentProps={contentProps}
    >
      <WarningMessage>
        {t(
          'It will take 2 days to retrieve your recovery phrase. You will only have 48 hours to copy your recovery phrase once the 2 day waiting period is over',
        )}
      </WarningMessage>
      <ActionButtons
        top={{
          label: t('Next'),
          onClick: navigateToNextStage,
          color: 'primary',
        }}
        bottom={{
          label: t('Cancel'),
          onClick: leave,
          color: 'secondary',
        }}
      />
    </Page>
  );
};
