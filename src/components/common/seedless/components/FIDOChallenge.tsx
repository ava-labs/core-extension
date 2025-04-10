import { useEffect } from 'react';
import {
  AlertCircleIcon,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useFidoErrorMessage } from '@src/hooks/useFidoErrorMessage';
import { Trans, useTranslation } from 'react-i18next';
import { AuthErrorCode } from 'packages/service-worker/src/services/seedless/models';

type Props = {
  error?: AuthErrorCode;
  isLoading: boolean;
  deviceName?: string;
  completeFidoChallenge: (force: boolean) => Promise<unknown>;
};
export const FIDOChallenge = ({
  error,
  deviceName,
  isLoading,
  completeFidoChallenge,
}: Props) => {
  const { t } = useTranslation();
  const errorMessage = useFidoErrorMessage(error);

  useEffect(() => {
    // It looks like the browser's FIDO challenge popup acts
    // like window.alert() in the sense that it stops re-renders.
    // I force the FIDO challenge to fire a bit later so the
    // component can finish rendering and the popup isn't blank.
    const timer = setTimeout(completeFidoChallenge, 1);

    return () => {
      clearTimeout(timer);
    };
  }, [completeFidoChallenge]);

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
      }}
    >
      <Stack
        sx={{
          mt: 2,
          gap: 3,
          px: 2,
          flexGrow: 1,
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {!errorMessage && isLoading && (
          <>
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="body1">
              {deviceName ? (
                <Trans
                  i18nKey="Please use your FIDO device (<b>{{ deviceName }}</b>) to continue."
                  components={{ b: <b /> }}
                  values={{ deviceName }}
                />
              ) : (
                t('Please use your FIDO device to continue.')
              )}
            </Typography>
          </>
        )}
        {errorMessage && (
          <>
            <AlertCircleIcon size={40} />
            <Typography variant="body2" color="text.secondary">
              {errorMessage}
            </Typography>
            <Button size="large" onClick={() => completeFidoChallenge(true)}>
              {t('Try again')}
            </Button>
          </>
        )}
      </Stack>
    </Stack>
  );
};
