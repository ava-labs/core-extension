import { Stack, StackProps, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';

import { NavButton } from '@/pages/Onboarding/components/NavButton';

import { ErrorType } from '../../types';

type KeystoneQRErrorProps = StackProps & {
  errorType: ErrorType;
  onRetry: () => void;
};

export const KeystoneQRError = ({
  errorType,
  onRetry,
  ...stackProps
}: KeystoneQRErrorProps) => {
  const { t } = useTranslation();

  return (
    <Stack
      width="100%"
      gap={3}
      textAlign="center"
      flexGrow={1}
      justifyContent="center"
      maxWidth="340px"
      {...stackProps}
    >
      <Stack gap={1.5} alignItems="center" color="error.main">
        {errorType === 'camera-access-denied' && <CameraBlockedMessage />}
        {errorType === 'invalid-qr-code' && <InvalidQRCodeMessage />}
      </Stack>
      {errorType && (
        <Stack direction="row" justifyContent="center">
          <NavButton size="medium" color="primary" onClick={onRetry}>
            {t('Retry')}
          </NavButton>
        </Stack>
      )}
    </Stack>
  );
};

const InvalidQRCodeMessage = () => {
  const { t } = useTranslation();

  return (
    <>
      <FiAlertCircle size={32} color="currentColor" />
      <Typography variant="body2">
        {t(
          'Invalid QR code. Please ensure you have selected a valid QR code from your Keystone device',
        )}
      </Typography>
    </>
  );
};

const CameraBlockedMessage = () => {
  const { t } = useTranslation();

  return (
    <>
      <FiAlertCircle size={32} color="currentColor" />
      <Stack color="error.main">
        <Typography variant="body2">
          {t('Access to camera has been blocked')}
        </Typography>
        <Typography variant="body2">
          {t('You must allow access to scan the QR code.')}
        </Typography>
      </Stack>
    </>
  );
};
