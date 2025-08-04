import { CircularProgress, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export const LoadingState = () => {
  const { t } = useTranslation();
  return (
    <Stack width={1} height={1} justifyContent="center" alignItems="center">
      <CircularProgress />
      <Typography variant="body1">
        {t('Loading export request state...')}
      </Typography>
    </Stack>
  );
};
