import { Button, CircularProgress, Typography } from '@avalabs/k2-alpine';
import { AuthErrorCode } from '@core/types';
import { useFidoErrorMessage } from '@core/ui';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';
import { StyledStackContent, StyledStackRoot } from '../styled';

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
    <StyledStackRoot>
      <StyledStackContent>
        {!errorMessage && isLoading && (
          <>
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="body1" textAlign="center">
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
            <MdErrorOutline size={40} />
            <Typography variant="body2" color="text.secondary">
              {errorMessage}
            </Typography>
            <Button size="large" onClick={() => completeFidoChallenge(true)}>
              {t('Try again')}
            </Button>
          </>
        )}
      </StyledStackContent>
    </StyledStackRoot>
  );
};
