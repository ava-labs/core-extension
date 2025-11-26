import { CircularProgress, Typography } from '@avalabs/k2-alpine';
import { SeedlessAuthProvider } from '@core/types';
import { Trans, useTranslation } from 'react-i18next';
import { StyledStackWaiting } from '../styled';

type Props = {
  provider?: SeedlessAuthProvider;
};

export const WaitingForAuthentication = ({ provider }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledStackWaiting>
      <CircularProgress size={32} sx={{ mb: 3 }} />
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
          'Do not close this window until the process is complete or you may need to restart.',
        )}
      </Typography>
    </StyledStackWaiting>
  );
};
