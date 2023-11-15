import {
  Typography,
  Stack,
  useTheme,
  Button,
  XIcon,
  TextField,
  CopyIcon,
  toast,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { Overlay } from '@src/components/common/Overlay';
import { TypographyLink } from '@src/pages/Onboarding/components/TypographyLink';
import { useCallback, useMemo, useState } from 'react';

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
  const theme = useTheme();
  const [step, setStep] = useState(activeStep);
  const code = 'random code strings number and other animals';

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast.success(t('Copied!'), { duration: 2000, position: 'top-left' });
  }, [t]);

  const headLines = useMemo(
    () => ({
      scan: t('Scan Qr Code'),
      verify: t('Verify Code'),
      key: t('Authenticator Setup'),
      help: t('Learn More'),
    }),
    [t]
  );

  const descriptions = useMemo(
    () => ({
      scan: (
        <>
          <Typography>
            {t(
              'On your mobile device, install an authenticator app and use it to scan this QR code. Or enter the code manually.'
            )}
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
        <Typography>
          {t(
            'Open any authenticator app and use it to enter the key found below. Or tap Scan QR Code. Learn more.'
          )}
        </Typography>
      ),
      help: (
        <Typography>
          {t('Use any authenticator app and paste in the code found below.')}
        </Typography>
      ),
    }),
    [t]
  );

  const contents = useMemo(
    () => ({
      scan: <Stack sx={{ p: 3 }}>Content Placeholder</Stack>,
      verify: (
        <Stack sx={{ p: 3 }}>
          <TextField
            inputProps={{ style: { textAlign: 'center' } }}
            type="tel"
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
          <Stack>
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
              [{code}]
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
            <Stack sx={{ rowGap: 0.5 }}>
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
                [{code}]
              </Typography>
            </Stack>
          </Stack>
          <Typography>
            {t(
              'If using Google Authenticator, make sure that Time based is selected.'
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
      onCopy,
      t,
      theme.palette.grey,
      theme.typography.h5.fontSize,
      theme.typography.subtitle2.fontSize,
    ]
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
      verify: <TypographyLink>{t('Resend')}</TypographyLink>,
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
    [t]
  );

  const nextStepAction = useMemo(
    () => ({
      scan: () => setStep(AuthenticatorSteps.VERIFY),
      help: () => setStep(AuthenticatorSteps.VERIFY),
      code: () => setStep(AuthenticatorSteps.VERIFY),
      verify: () => {
        onFinish();
      },
    }),
    [onFinish]
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
              justifyContent: 'center',
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
            >
              {t('Cancel')}
            </Button>
            <Button
              data-testid="authenticator-modal-next"
              onClick={nextStepAction[step]}
            >
              {t('Next')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Overlay>
  );
}
