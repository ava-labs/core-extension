import { Page } from '@/components/Page';
import { Button } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export const FIDODetails = ({ method }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>FIDODetails</div>
      <Button>{t('Remove')}</Button>
    </>
  );
};
