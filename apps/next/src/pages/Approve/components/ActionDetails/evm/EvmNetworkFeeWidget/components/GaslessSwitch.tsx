import { useTranslation } from 'react-i18next';
import { Stack, Switch, Tooltip, Typography } from '@avalabs/k2-alpine';

export const GaslessSwitchRow = () => {
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py={1}
      px={2}
    >
      <Stack>
        <Typography variant="body3" color="text.primary">
          {t('Get free gas')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('Gas fees paid by Core')}
        </Typography>
      </Stack>
      <Tooltip title={t('Coming soon!')}>
        <Switch size="small" checked={false} />
      </Tooltip>
    </Stack>
  );
};
