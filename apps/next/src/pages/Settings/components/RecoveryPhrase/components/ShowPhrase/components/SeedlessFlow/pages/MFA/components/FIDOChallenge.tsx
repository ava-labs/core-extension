import {
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';
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
import { InProgress } from '../../../../InProgress';
import { ChallengeComponentProps } from '../../../types';
import { useParams } from 'react-router-dom';
import { RecoveryMethodsFullScreenParams } from '@/pages/Settings/components/RecoveryMethods/FullScreens/RecoveryMethodsFullScreen';

type Props = ChallengeComponentProps<
  MfaRequestType.Fido | MfaRequestType.FidoRegister
>;

export const FIDOChallenge: FC<Props> = ({
  name: deviceName,
  error,
  onError,
  challenge,
}) => {
  const { t } = useTranslation();
  const errorMessage = useFidoErrorMessage(error);
  const { request } = useConnectionContext();
  const [force, setForce] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { keyType } = useParams<RecoveryMethodsFullScreenParams>();

  useEffect(() => {
    if (isVerifying && !force) {
      return;
    }

    setIsVerifying(true);
    setForce(false);
    onError(undefined);

    launchFidoFlow(
      challenge.type === MfaRequestType.Fido
        ? FIDOApiEndpoint.Authenticate
        : FIDOApiEndpoint.Register,
      challenge.options,
      challenge.type === MfaRequestType.FidoRegister ? keyType : undefined,
    )
      .then((answer) => {
        console.log('answer: ', answer);
        request<SubmitMfaResponseHandler>({
          method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
          params: [
            {
              mfaId: challenge?.mfaId,
              answer,
            },
          ],
        });
      })
      .catch(() => onError(AuthErrorCode.FidoChallengeFailed));
  }, [
    onError,
    request,
    isVerifying,
    challenge?.mfaId,
    force,
    challenge.options,
    challenge.type,
    keyType,
  ]);

  return (
    <>
      <FullscreenModalTitle>{t('Verify via FIDO')}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {deviceName ? (
          <Trans
            i18nKey="Please use (<b>{{deviceName}}</b>) FIDO device to continue."
            components={{ b: <strong /> }}
            values={{ deviceName }}
          />
        ) : (
          t('Please use selected FIDO device to continue.')
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent>
        <Stack
          gap={3}
          textAlign="center"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          {!errorMessage && isVerifying && (
            <InProgress textSize="body1">{t('Verifying...')}</InProgress>
          )}
          {errorMessage && (
            <>
              <MdErrorOutline size={40} />
              <Typography variant="body2" color="text.secondary">
                {errorMessage}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setForce(true)}
              >
                {t('Try again')}
              </Button>
            </>
          )}
        </Stack>
      </FullscreenModalContent>
    </>
  );
};
