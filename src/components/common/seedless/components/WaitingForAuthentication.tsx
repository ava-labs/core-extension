import { Trans, useTranslation } from 'react-i18next';
import { CircularProgress, Stack, Typography } from '@avalabs/k2-components';

import { SeedlessAuthProvider } from '@src/background/services/wallet/models';

type Props = {
  provider?: SeedlessAuthProvider;
};

export const WaitingForAuthentication = ({ provider }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        width: 1,
        px: 5,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <CircularProgress size={48} sx={{ mb: 3 }} />
      <Typography variant="h4">
        <Trans
          i18nKey="Waiting for <bold>{{provider}}</bold> authentication to complete"
          components={{
            bold: <b style={{ textTransform: 'capitalize' }} />,
          }}
          values={{ provider }}
        />
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t(
          'Do not close this window until the process is complete or you may need to restart.'
        )}
      </Typography>
    </Stack>
  );
};
