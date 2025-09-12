import { SlideUpDialog } from '@/components/Dialog';
import { Page } from '@/components/Page';
import { Button, Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { RecoveryMethodFailure } from './RecoveryMethodFailure';

export const ConfirmPage = ({ onConfirm, onCancel, title, warning }) => {
  const { t } = useTranslation();
  return (
    <SlideUpDialog open>
      <Page
        title={title}
        contentProps={{
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
        onBack={onCancel}
      >
        <Stack justifyContent="space-between" height="100%">
          <RecoveryMethodFailure text={warning} />
          <Stack gap={1}>
            <Button
              variant="contained"
              color="primary"
              size="extension"
              onClick={onConfirm}
            >
              {t('Next')}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="extension"
              onClick={onCancel}
            >
              {t('Back')}
            </Button>
          </Stack>
        </Stack>
      </Page>
    </SlideUpDialog>
  );
};
