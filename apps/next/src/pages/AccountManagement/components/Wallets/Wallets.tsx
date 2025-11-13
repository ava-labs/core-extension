import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { AddOrConnectWalletButton } from '../AddOrCreateWallet';
import { BulkDeleteButtons } from './components/BulkDeleteButtons';
import { WalletList } from './components/WalletList';
import { useTranslation } from 'react-i18next';

export const Wallets: FC = () => {
  const { t } = useTranslation();
  return (
    <Stack gap={1.5} height={1}>
      <Stack gap={1}>
        <Stack direction="row" gap={1} justifyContent="space-between">
          <Typography variant="h2" component="h1">
            {t('My Wallets')}
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ width: '60%' }}>
          {t('An overview of your wallets and\nassociated accounts')}
        </Typography>
      </Stack>
      <Stack gap={1.5} overflow="auto">
        <WalletList />
      </Stack>
      <BulkDeleteButtons />
      <AddOrConnectWalletButton />
    </Stack>
  );
};
