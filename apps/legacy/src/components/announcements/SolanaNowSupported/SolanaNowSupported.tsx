import {
  Button,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '@/components/common/Dialog';
import { MagicSolanaLogo } from '@/components/common/MagicSolanaLogo';

type Props = {
  open: boolean;
  onProceed: VoidFunction;
  onSkip: VoidFunction;
};

export const SOLANA_NOW_SUPPORTED_BANNER_ID =
  'c8138919-f458-4828-a0f3-d37abbbdc79b';

export const SolanaNowSupported: FC<Props> = ({ onProceed, onSkip, open }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onSkip}
      title={t('Solana Now Supported!')}
      content={
        <Stack textAlign="center">
          <Typography
            variant="body2"
            align="left"
            color={theme.palette.grey[500]}
            lineHeight="20px"
          >
            {t(
              `To get started on Solana add an account to your wallet using the button below.`,
            )}
          </Typography>
          <MagicSolanaLogo outerSize={320} innerSize={187} />
          <Button size="large" fullWidth color="primary" onClick={onProceed}>
            {t('Get Started')}
          </Button>
        </Stack>
      }
    />
  );
};
