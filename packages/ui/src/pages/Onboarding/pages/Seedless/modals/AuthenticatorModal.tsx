import {
  Typography,
  Stack,
  useTheme,
  Button,
  XIcon,
  TextField,
  CopyIcon,
  toast,
  CircularProgress,
} from '@avalabs/core-k2-components';
import { Trans, useTranslation } from 'react-i18next';
import { Overlay } from 'packages/ui/src/components/common/Overlay';
import { TypographyLink } from 'packages/ui/pages/Onboarding/components/TypographyLink';
import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode.react';
import { useSeedlessActions } from 'packages/ui/pages/Onboarding/hooks/useSeedlessActions';
import { InlineBold } from 'packages/ui/src/components/common/InlineBold';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export enum AuthenticatorSteps {
  SCAN = 'scan',
  KEY = 'key',
  VERIFY = 'verify',
  HELP = 'help',
}

interface AuthenticatorModalProps {
  activeStep: AuthenticatorSteps;
  onFinish: () => void;
  onCancel: () => void;
}

export function AuthenticatorModal({
  activeStep,
  onFinish,
  onCancel,
}: AuthenticatorModalProps) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const theme = useTheme();
  const [step, setStep] = useState(activeStep);
  const { registerTOTPStart, totpChallenge, verifyRegistrationCode } =
    useSeedlessActions();
  const [totpCode, setTotpCode] = useState('');
  const [isCodeVerifying, setIsCodeVerifying] = useState(false);
  const [error, setError] = useState('');
  const totpSecret = totpChallenge
    ? new URL(totpChallenge.totpUrl).searchParams.get('secret')
    : '';

  useEffect(() => {
    registerTOTPStart();
  }, [registerTOTPStart]);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(totpSecret || '');
    toast.success(t('Copied!'), { duration: 2000, position: 'top-left' });
  }, [t, totpSecret]);

  const headLines = useMemo(
    () => ({
      scan: t('Scan Qr Code'),
      verify: t('Verify Code'),
      key: t('Authenticator Setup'),
      help: t('Learn More'),
    }),
    [t],
  );

  const verifyCode = useCallback(async () => {
    setIsCodeVerifying(true);
    const isSuccessful = await verifyRegistrationCode(totpCode);
    if (!isSuccessful) {
      capture('SeedlessAuthenticatorVerificationFailed');
      setError(t('Incorrect code. Try again.'));
    }
    if (isSuccessful) {
      capture('SeedlessAuthenticatorVerificationSuccess');
      onFinish();
      setError('');
    }

    setIsCodeVerifying(false);
  }, [capture, onFinish, t, totpCode, verifyRegistrationCode]);

  const descriptions = useMemo(
    () => ({
      scan: (
        <>
          <Typography>
            <Trans
              i18nKey="On your mobile device, install an <bold>authenticator app</bold> and use it to scan this QR code. Or enter the code manually."
              components={{
                bold: <InlineBold />,
              }}
            />
          </Typography>
          <TypographyLink onClick={() => setStep(AuthenticatorSteps.HELP)}>
            {t('Learn more')}
          </TypographyLink>
        </>
      ),
      verify: (
        <Typography>
          {t('Enter the code generated from your authenticator app.')}
        </Typography>
      ),
      key: (
        <>
          <Typography>
            {t(
              'Open any authenticator app and use it to enter the key found below. Or tap Scan QR Code.',
            )}
          </Typography>
          <TypographyLink onClick={() => setStep(AuthenticatorSteps.HELP)}>
            {t('Learn more')}
          </TypographyLink>
        </>
      ),
      help: (
        <Typography>
          {t('Use any authenticator app and paste in the code found below.')}
        </Typography>
      ),
    }),
    [t],
  );

  const contents = useMemo(
    () => ({
      scan: (
        <Stack sx={{ p: 3 }}>
          {totpChallenge ? (
            <Stack
              sx={{
                p: 1,
                backgroundColor: theme.palette.common.white,
                borderRadius: 1,
              }}
            >
              <QRCode
                renderAs="svg"
                fgColor={theme.palette.common.black}
                bgColor={theme.palette.common.white}
                value={totpChallenge.totpUrl}
                level="H"
                size={180}
              />
            </Stack>
          ) : (
            <CircularProgress />
          )}
        </Stack>
      ),
      verify: (
        <Stack sx={{ width: '100%' }}>
          <TextField
            inputProps={{ style: { width: '100%' } }}
            type="tel"
            onChange={(event) => setTotpCode(event.target.value)}
            rows={3}
            multiline
            error={!!error}
            helperText={error}
            onKeyDown={async (event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                await verifyCode();
              }
            }}
          />
        </Stack>
      ),
      key: (
        <Stack
          onClick={onCopy}
          sx={{
            backgroundColor: theme.palette.grey[850],
            flexDirection: 'row',
            columnGap: 2,
            p: 2,
            width: '358px',
            cursor: 'pointer',
          }}
        >
          <Stack sx={{ rowGap: 1 }}>
            <CopyIcon size={24} />
          </Stack>
          <Stack sx={{ wordBreak: 'break-all' }}>
            <Typography
              variant="button"
              sx={{ fontSize: theme.typography.subtitle2.fontSize }}
            >
              {t('Copy Key')}
            </Typography>
            <Typography
              variant="button"
              sx={{ fontSize: theme.typography.h5.fontSize }}
            >
              {totpSecret}
            </Typography>
          </Stack>
        </Stack>
      ),
      help: (
        <Stack sx={{ width: '358px' }}>
          <Stack
            onClick={onCopy}
            sx={{
              backgroundColor: theme.palette.grey[850],
              flexDirection: 'row',
              columnGap: 2,
              p: 2,
              cursor: 'pointer',
              mb: 2,
            }}
          >
            <Stack sx={{ rowGap: 1 }}>
              <CopyIcon size={24} />
            </Stack>
            <Stack sx={{ rowGap: 0.5, wordBreak: 'break-all' }}>
              <Typography
                variant="button"
                sx={{ fontSize: theme.typography.subtitle2.fontSize }}
              >
                {t('Copy Key')}
              </Typography>
              <Typography
                variant="button"
                sx={{ fontSize: theme.typography.h5.fontSize }}
              >
                {totpSecret}
              </Typography>
            </Stack>
          </Stack>
          <Typography>
            {t(
              'If using Google Authenticator, make sure that Time based is selected.',
            )}
          </Typography>
          <Typography>
            {t('If using Microsoft Authenticator, click Add Account.')}
          </Typography>
          <Typography>
            {t('If using Authenticator App, click the + to add account.')}
          </Typography>
        </Stack>
      ),
    }),
    [
      error,
      onCopy,
      t,
      theme.palette.common.black,
      theme.palette.common.white,
      theme.palette.grey,
      theme.typography.h5.fontSize,
      theme.typography.subtitle2.fontSize,
      totpChallenge,
      totpSecret,
      verifyCode,
    ],
  );

  const actionButtons = useMemo(
    () => ({
      scan: (
        <TypographyLink
          onClick={() => {
            setStep(AuthenticatorSteps.KEY);
          }}
        >
          {t('Enter Code Manually')}
        </TypographyLink>
      ),
      verify: null,
      key: (
        <TypographyLink
          onClick={() => {
            setStep(AuthenticatorSteps.SCAN);
          }}
        >
          {t('Scan QR Code')}
        </TypographyLink>
      ),
      help: (
        <TypographyLink onClick={() => setStep(AuthenticatorSteps.SCAN)}>
          {t('Back')}
        </TypographyLink>
      ),
    }),
    [t],
  );

  const nextStepAction = useMemo(
    () => ({
      scan: () => setStep(AuthenticatorSteps.VERIFY),
      help: () => setStep(AuthenticatorSteps.VERIFY),
      code: () => setStep(AuthenticatorSteps.VERIFY),
      verify: () => verifyCode(),
    }),
    [verifyCode],
  );

  return (
    <Overlay>
      <Stack
        sx={{
          width: '512px',
          minHeight: '407px',
          background: theme.palette.background.paper,
          borderRadius: 1,
          p: 1,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              pt: 3,
              px: 4,
            }}
            data-testid={`authenticator-modal-header`}
          >
            {headLines[step]}
          </Typography>
          <Button
            variant="text"
            data-testid={`authenticator-modal-close-button`}
            onClick={onCancel}
            sx={{
              p: 0,
              height: theme.spacing(3),
              width: theme.spacing(3),
              minWidth: theme.spacing(3),
            }}
          >
            <XIcon size={24} sx={{ color: 'primary.main' }} />
          </Button>
        </Stack>
        <Stack
          sx={{
            flexGrow: 1,
            pt: 1,
            px: 4,
          }}
        >
          <Typography variant="body2" minHeight={40}>
            {descriptions[step]}
          </Typography>
          <Stack
            sx={{
              alignItems: 'center',
              height: '100%',
              justifyContent:
                step !== AuthenticatorSteps.VERIFY ? 'center' : 'flex-start',
              flexGrow: 1,
            }}
          >
            {contents[step]}
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Stack>
            <TypographyLink>{actionButtons[step]}</TypographyLink>
          </Stack>
          <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
            <Button
              color="secondary"
              data-testid="authenticator-modal-cancel"
              onClick={onCancel}
              isDisabled={isCodeVerifying}
            >
              {t('Cancel')}
            </Button>
            <Button
              data-testid="authenticator-modal-next"
              onClick={nextStepAction[step]}
              isLoading={isCodeVerifying}
              isDisabled={isCodeVerifying}
            >
              {t('Next')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Overlay>
  );
}
