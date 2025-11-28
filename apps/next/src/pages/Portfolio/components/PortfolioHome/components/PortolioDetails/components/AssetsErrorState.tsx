import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useBalancesContext } from '@core/ui';
import { useAccountsContext } from '@core/ui';

export const AssetsErrorState: FC = () => {
  const { t } = useTranslation();
  const { updateBalanceOnNetworks } = useBalancesContext();
  const { accounts } = useAccountsContext();

  const handleRefresh = async () => {
    if (accounts.active && updateBalanceOnNetworks) {
      await updateBalanceOnNetworks([accounts.active]);
    } else {
      window.location.reload();
    }
  };

  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      gap={1}
      px={5}
      textAlign="center"
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>😩</span>
      <Typography variant="subtitle3">
        {t('Oops! Something went wrong')}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t('Please hit refresh or try again later')}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={handleRefresh}
        sx={{
          mt: 2,
        }}
      >
        {t('Refresh')}
      </Button>
    </Stack>
  );
};
