import { Page } from '@/components/Page';
import { Button, Typography } from '@avalabs/k2-alpine';
import { useConnectionContext, useSeedlessMfaManager } from '@core/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useMFAEvents } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA/hooks/useMFAEvent';
import { AuthErrorCode, ExtensionRequest, MfaResponseData } from '@core/types';
import { TotpCodeField } from '@/components/TotpCodeField';
import { SubmitMfaResponseHandler } from '~/services/seedless/handlers/submitMfaResponse';

export const FIDO = () => {
  const { removeFidoDevice } = useSeedlessMfaManager();
  const { t } = useTranslation();
  const [error, setError] = useState<AuthErrorCode>();
  const [code, setCode] = useState();
  const { request } = useConnectionContext();
  console.log('code: ', code);
  console.log('FIDO error: ', error);
  const mfaEvents = useMFAEvents(setError);
  console.log('mfaEvents: ', mfaEvents);
  const { id } = useParams<{ id: string }>();
  const { hash } = useLocation();
  console.log('hash: ', hash);
  const deviceId = `${id}${hash}`;
  // const id =
  //   'FidoKey#CWEYvVBjNFJSVB_Qjr3dcIs0mw6T6IcTASzEke_lbclVGTb-FRP5ZpUOXNMsRwBz7ZajS3NFeQH8pCa3h3mbJeUPWT8ocGMsdhF14ob2MB4dNBsGAfkchwRQTb1Vkv-B-t4KbPHtVD-dxncLdk6iwI6XVlXd2HAnekp_SB9fI-0=';
  console.log('deviceId: ', deviceId);

  useEffect(() => {
    removeFidoDevice(deviceId).then((result) => {
      console.log('result: ', result);
    });
  }, [deviceId, removeFidoDevice]);

  const submit = useCallback(
    (params: MfaResponseData) => {
      // setIsVerifying(true);
      // onError(undefined);

      try {
        request<SubmitMfaResponseHandler>({
          method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
          params: [params],
        });
      } catch {
        // onError(AuthErrorCode.TotpVerificationError);
      } finally {
        // setIsVerifying(false);
      }
    },
    [request],
  );

  return (
    <Page
      title={t('Remove FIDO Device')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Typography variant="caption">
        {t(
          'Open any authenticator app and scan the QR code below or enter the code manually',
        )}
      </Typography>
      {mfaEvents.challenge && mfaEvents.challenge.type === 'totp' && (
        <>
          <TotpCodeField
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              // setIsSubmitted(true);
              // setIsVerifying(true);
              submit({
                mfaId: mfaEvents.challenge.mfaId,
                code,
              });
            }}
          >
            {t('Verify')}
          </Button>
        </>
      )}
    </Page>
  );
};
