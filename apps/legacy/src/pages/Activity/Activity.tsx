import { Stack, Typography } from '@avalabs/core-k2-components';
import { WalletRecentTxs } from '../Wallet/WalletRecentTxs';
import { useTranslation } from 'react-i18next';

type ActivityProps = {
  isEmbedded?: boolean;
  tokenSymbolFilter?: string;
};

export function Activity({
  isEmbedded = false,
  tokenSymbolFilter,
}: ActivityProps) {
  const { t } = useTranslation();
  return (
    <Stack alignItems="center" sx={{ flex: 1, width: '100%' }}>
      {isEmbedded && (
        <Stack direction="row" sx={{ width: '100%' }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'fontWeightSemibold' }}
          >
            {t('Activity')}
          </Typography>
        </Stack>
      )}
      <WalletRecentTxs
        tokenSymbolFilter={tokenSymbolFilter}
        isEmbedded={isEmbedded}
      />
    </Stack>
  );
}
