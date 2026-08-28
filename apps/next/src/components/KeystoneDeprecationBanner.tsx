import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdError } from 'react-icons/md';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { useIsUsingKeystoneWallet } from '@core/ui';

export const KeystoneDeprecationBanner: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();

  if (!isUsingKeystoneWallet) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      gap={0.5}
      data-testid="keystone-deprecation-banner"
    >
      <MdError
        size={20}
        color={theme.palette.error.main}
        style={{ flexShrink: 0 }}
      />
      <Typography variant="subtitle4" color="error">
        {t(
          'Support for Keystone wallets was deprecated on September 1st, 2026',
        )}
      </Typography>
    </Stack>
  );
};
