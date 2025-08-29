import {
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { SecretType } from '@core/types';
import { useWalletContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { MnemonicFlow } from './components/MnemonicFlow';
import { SeedlessFlow } from './components/SeedlessFlow';

export const ShowPhrase: FC = () => {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();

  if (!walletDetails) {
    return (
      <Stack width={1} height={1} justifyContent="center" alignItems="center">
        <CircularProgress />
        <Typography variant="body1">
          {t('Loading wallet details...')}
        </Typography>
      </Stack>
    );
  }

  const walletType = walletDetails.type;

  if (walletType === SecretType.Mnemonic) {
    return <MnemonicFlow />;
  }

  if (walletType === SecretType.Seedless) {
    return <SeedlessFlow />;
  }

  return <Redirect to="/settings" />;
};
