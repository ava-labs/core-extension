import { FC } from 'react';
import { Trans } from 'react-i18next';
import { MdError } from 'react-icons/md';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { useIsUsingKeystoneWallet } from '@core/ui';

export const KeystoneDeprecationBanner: FC = () => {
  const theme = useTheme();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();

  if (!isUsingKeystoneWallet) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      data-testid="keystone-deprecation-banner"
    >
      <MdError
        size={20}
        color={theme.palette.error.main}
        style={{ flexShrink: 0 }}
      />
      <Typography variant="subtitle4" color="error">
        <Trans i18nKey="Support for Keystone wallets was<br/>deprecated on September 1st, 2026" />
      </Typography>
    </Stack>
  );
};
