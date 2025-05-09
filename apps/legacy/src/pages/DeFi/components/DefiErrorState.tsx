import { useTranslation } from 'react-i18next';
import {
  AlertCircleIcon,
  Stack,
  StackProps,
  Typography,
} from '@avalabs/core-k2-components';

export const DefiErrorState = (props: StackProps) => {
  const { t } = useTranslation();

  return (
    <Stack sx={{ mt: 9, gap: 1, alignItems: 'center' }} {...props}>
      <AlertCircleIcon size={60} sx={{ mb: 2 }} />
      <Typography variant="h5">{t('Error!')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('Data currently unavailable, check back later.')}
      </Typography>
    </Stack>
  );
};
