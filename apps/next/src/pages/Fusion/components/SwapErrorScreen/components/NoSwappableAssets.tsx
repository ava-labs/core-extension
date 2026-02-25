import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';

export const NoSwappableAssets = () => {
  const { t } = useTranslation();
  const { allAccounts } = useAccountsContext();

  const hasMultipleAccounts = allAccounts.length > 1;

  return (
    <Stack alignItems="center" justifyContent="center" gap={0.5}>
      <Typography
        variant="h2"
        component="span"
        role="img"
        aria-label="no-assets"
        marginBottom={2}
      >
        💰
      </Typography>
      <Typography variant="subtitle3">
        {t('No assets available for swapping')}
      </Typography>
      {hasMultipleAccounts && (
        <Typography variant="body3" color="text.secondary">
          {t('Try to switch to a different account')}
        </Typography>
      )}
    </Stack>
  );
};
