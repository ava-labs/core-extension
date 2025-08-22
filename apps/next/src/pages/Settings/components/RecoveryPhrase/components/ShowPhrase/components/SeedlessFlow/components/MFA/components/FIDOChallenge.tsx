import {
  Button,
  CircularProgress,
  DialogContent,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { launchFidoFlow } from '@core/common';
import {
  AuthErrorCode,
  ExtensionRequest,
  FIDOApiEndpoint,
  MfaRequestType,
} from '@core/types';
import { useConnectionContext, useFidoErrorMessage } from '@core/ui';
import { FC, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';
import { SubmitMfaResponseHandler } from '~/services/seedless/handlers/submitMfaResponse';
import { ChallengeComponentProps } from '../../../types';

type Props = ChallengeComponentProps<
  MfaRequestType.Fido | MfaRequestType.FidoRegister
>;

export const FIDOChallenge: FC<Props> = ({
  name,
  error,
  onError,
  challenge,
}) => {
  const { t } = useTranslation();
  const errorMessage = useFidoErrorMessage(error);
  const { request } = useConnectionContext();
  const [force, setForce] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isVerifying && !force) {
      return;
    }

    setIsVerifying(true);
    setForce(false);
    onError(undefined);

    try {
      launchFidoFlow(FIDOApiEndpoint.Authenticate, challenge.options).then(
        (answer) => {
          request<SubmitMfaResponseHandler>({
            method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
            params: [
              {
                mfaId: challenge?.mfaId,
                answer,
              },
            ],
          });
        },
      );
    } catch (_err) {
      onError(AuthErrorCode.FidoChallengeFailed);
    }
  }, [
    onError,
    request,
    isVerifying,
    challenge.mfaId,
    force,
    challenge.options,
  ]);

  return (
    <DialogContent>
      <Stack
        sx={{
          gap: 3,
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        {!errorMessage && isVerifying && (
          <>
            <CircularProgress size={48} />
            <Typography variant="body1">
              {name ? (
                <Trans
                  i18nKey="Please use your FIDO device (<b>{{deviceName}}</b>) to continue."
                  components={{ b: <strong /> }}
                  values={{ deviceName: name }}
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
            <Button size="large" onClick={() => setForce(true)}>
              {t('Try again')}
            </Button>
          </>
        )}
      </Stack>
    </DialogContent>
  );
};
