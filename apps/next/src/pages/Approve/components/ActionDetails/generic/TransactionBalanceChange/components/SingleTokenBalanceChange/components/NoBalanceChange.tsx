import { Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const NoBalanceChange: FC = () => {
  const { t } = useTranslation();
  return <Typography variant="body3">{t('No balance changes')}</Typography>;
};
