import {
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

export function NoTransactions({ loading = false }: { loading: boolean }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Stack sx={{ alignItems: 'center', flexGrow: 1, mt: 13 }}>
      {loading ? (
        <CircularProgress size={32} />
      ) : (
        <>
          <Typography variant="h5">{t('No transactions')}</Typography>
          <Typography
            variant="body2"
            sx={{ my: 1, color: theme.palette.primary.dark }}
          >
            {t('Once you transact, it will be displayed here')}
          </Typography>
        </>
      )}
    </Stack>
  );
}
