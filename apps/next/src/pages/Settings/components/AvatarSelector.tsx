import { Page } from '@/components/Page';
import { useTranslation } from 'react-i18next';

export const AvatarSelector = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('Select your personal avatar')} withBackButton>
      {'avatar'}
    </Page>
  );
};
