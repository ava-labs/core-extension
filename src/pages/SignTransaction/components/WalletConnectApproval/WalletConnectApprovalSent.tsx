import {
  Alert,
  AlertTitle,
  Button,
  CheckCircleIcon,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WalletConnectApprovalSentProps {
  onResend: () => void;
  currentSignature: number;
  requiredSignatures: number;
}

export function WalletConnectApprovalSent({
  onResend,
  currentSignature,
  requiredSignatures,
}: WalletConnectApprovalSentProps) {
  const { t } = useTranslation();
  const [disableButton, setDisableButton] = useState(true);
  const resendButtonTimer = useRef<ReturnType<typeof setTimeout>>();
  const requiresMultipleSignatures = requiredSignatures > 1;

  const enableButtonAfterDelay = useCallback(() => {
    if (typeof resendButtonTimer.current !== 'undefined') {
      clearTimeout(resendButtonTimer.current);
    }

    resendButtonTimer.current = setTimeout(() => {
      setDisableButton(false);
      resendButtonTimer.current = undefined;
    }, 7500);
  }, []);

  useEffect(() => {
    enableButtonAfterDelay();

    return () => {
      if (typeof resendButtonTimer.current !== 'undefined') {
        clearTimeout(resendButtonTimer.current);
      }
    };
  });

  function resend(): void {
    setDisableButton(true);
    onResend();
    enableButtonAfterDelay();
  }

  return (
    <Stack
      sx={{
        justifyContent: 'start',
        width: '100%',
        height: '100%',
        px: 3,
      }}
    >
      {requiresMultipleSignatures && (
        <Alert severity="info">
          <AlertTitle>
            {t('This transaction requires two approvals')}
          </AlertTitle>
          {t('Please pay attention to your mobile device')}
        </Alert>
      )}
      <Stack
        sx={{
          gap: 1,
          alignItems: 'center',
          mt: requiresMultipleSignatures ? 5 : 10,
          textAlign: 'center',
        }}
      >
        <CheckCircleIcon size={72} sx={{ color: 'success.main' }} />
        {!requiresMultipleSignatures && (
          <>
            <Typography variant="h5">
              {t('Request Successfully Sent!')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Please sign on your mobile wallet.')}
            </Typography>
          </>
        )}
        {requiresMultipleSignatures && (
          <>
            <Typography variant="h5">
              {currentSignature === 1
                ? t('First Request Sent!')
                : t('Almost done!')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {currentSignature === 1
                ? t('Please approve it on your mobile wallet.')
                : t('Please approve the second request, too.')}
            </Typography>
          </>
        )}
        {currentSignature === 1 && (
          // We can't resend just the 2nd signature request.
          // Clicking "Resend" in this situation would start the whole operation from scratch.
          <Stack sx={{ px: 3, mt: 1, width: '100%' }}>
            <Button
              fullWidth
              onClick={resend}
              size="xlarge"
              disabled={disableButton}
              isLoading={disableButton}
            >
              {t('Resend')}
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
