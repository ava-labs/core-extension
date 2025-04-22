import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { isSolanaNetwork } from '@src/background/services/network/utils/isSolanaNetwork';
import { useTranslation } from 'react-i18next';

export function NoTransactions({
  loading = false,
  network,
  explorerUrl,
}: {
  loading: boolean;
  network?: NetworkWithCaipId;
  explorerUrl?: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack sx={{ alignItems: 'center', flexGrow: 1, mt: 9 }}>
      {loading ? (
        <CircularProgress size={32} />
      ) : isSolanaNetwork(network) ? (
        <>
          <Typography variant="h5">{t('No Recent Activity')}</Typography>
          <Typography
            variant="body2"
            sx={{ my: 1, color: theme.palette.primary.dark }}
          >
            {t('We only display recent transactions for Solana')}
          </Typography>
          {explorerUrl && (
            <Stack sx={{ flexDirection: 'row', width: '100%', px: 2, my: 2 }}>
              <Button
                data-testid="view-history-button"
                fullWidth
                width="100%"
                onClick={() => {
                  window.open(explorerUrl, '_blank', 'noreferrer');
                }}
              >
                {t('View full history on explorer')}
              </Button>
            </Stack>
          )}
        </>
      ) : (
        <>
          <Typography variant="h5">{t('No Activity')}</Typography>
          <Typography
            variant="body2"
            sx={{ my: 1, color: theme.palette.primary.dark }}
          >
            {t('Add assets by Buying or Receiving')}
          </Typography>
        </>
      )}
    </Stack>
  );
}
