import { Page } from '@/components/Page';
import { Button } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export const AuthenticatorDetails = ({ method }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>AuthenticatorDetails</div>
      <Button>{t('Change Authenticator App')}</Button>
      <Button>{t('Removes')}</Button>
    </>
  );
};
