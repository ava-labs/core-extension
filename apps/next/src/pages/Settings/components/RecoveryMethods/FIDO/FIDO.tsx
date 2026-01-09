import { Page } from '@/components/Page';
import { Button, Stack, toast, Typography } from '@avalabs/k2-alpine';
import {
  useConnectionContext,
  useKeyboardShortcuts,
  useSeedlessMfaManager,
  useTotpErrorMessage,
} from '@core/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMFAEvents } from '../../common/useMFAEvent';
import { AuthErrorCode, ExtensionRequest, MfaResponseData } from '@core/types';
import { TotpCodeField } from '@/components/TotpCodeField';
import { SubmitMfaResponseHandler } from '~/services/seedless/handlers/submitMfaResponse';
import { InProgress } from '@/pages/Settings/components/common/InProgress';

export const FIDO = () => {
  const history = useHistory();
  const { removeFidoDevice } = useSeedlessMfaManager();
  const { t } = useTranslation();
  const [error, setError] = useState<AuthErrorCode>();
  const totpError = useTotpErrorMessage(error);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const { request } = useConnectionContext();

  const mfaEvents = useMFAEvents(setError);

  const { id } = useParams<{ id: string }>();
  const { hash } = useLocation();

  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => submitButtonRef.current?.click(),
  });

  const deviceId = `${id}${hash}`;

  useEffect(() => {
    const remove = async () => {
      try {
        await removeFidoDevice(deviceId);
        toast.success(t('FIDO device removed!'));
      } catch {
        toast.error(t('Error occurred. Please try again.'));
      } finally {
        history.push('/settings/recovery-methods');
      }
    };
    remove();
  }, [deviceId, history, removeFidoDevice, t]);

  const submitCode = useCallback(
    async (params: MfaResponseData) => {
      setIsVerifying(true);

      try {
        await request<SubmitMfaResponseHandler>({
          method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
          params: [params],
        });
      } catch {
        setError(AuthErrorCode.TotpVerificationError);
      } finally {
        setIsVerifying(false);
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
        {t('Enter the code generated from your authenticator app.')}
      </Typography>
      {(!mfaEvents || !mfaEvents.challenge) && <InProgress textSize="body1" />}
      {mfaEvents.challenge && mfaEvents.challenge.type === 'totp' && (
        <Stack
          sx={{ height: '100%', justifyContent: 'space-between' }}
          {...keyboardShortcuts}
        >
          <TotpCodeField
            error={!!totpError}
            helperText={totpError}
            onChange={(e) => {
              setCode(e.target.value);
              setError(undefined);
            }}
          />
          <Button
            ref={submitButtonRef}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              if (!mfaEvents.challenge) {
                return;
              }
              submitCode({
                mfaId: mfaEvents.challenge.mfaId,
                code,
              });
            }}
            loading={isVerifying}
            disabled={!code || isVerifying}
            fullWidth
          >
            {t('Verify')}
          </Button>
        </Stack>
      )}
    </Page>
  );
};
