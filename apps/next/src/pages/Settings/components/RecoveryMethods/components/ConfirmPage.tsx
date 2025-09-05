import { SlideUpDialog } from '@/components/Dialog';
import { Page } from '@/components/Page';
import { Button } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export const ConfirmPage = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <SlideUpDialog open>
      <Page
        title={t('Recovery methods')}
        contentProps={{
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        <Button onClick={onNext}>{t('Next')}</Button>
        <Button onClick={onBack}>{t('Back')}</Button>
      </Page>
    </SlideUpDialog>
  );
};
