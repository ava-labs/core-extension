import { FC } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Stack, StackProps, Typography } from '@avalabs/k2-alpine';

import { ErrorType } from '../types';

type QRErrorMessageProps = StackProps & {
  errorType: ErrorType;
};

export const QRErrorMessage: FC<QRErrorMessageProps> = ({
  errorType,
  ...stackProps
}) => (
  <Stack
    width="100%"
    gap={3}
    textAlign="center"
    flexGrow={1}
    justifyContent="center"
    position="absolute"
    px={4}
    {...stackProps}
  >
    <Stack gap={1.5} alignItems="center" textAlign="center" color="error.main">
      {errorType === 'camera-access-denied' && <CameraBlockedMessage />}
      {errorType === 'invalid-qr-code' && <InvalidQRCodeMessage />}
    </Stack>
  </Stack>
);

const InvalidQRCodeMessage = () => {
  const { t } = useTranslation();

  return (
    <>
      <FiAlertCircle size={32} color="currentColor" />
      <Stack>
        <Typography variant="caption">{t('Invalid QR code.')}</Typography>
        <Typography variant="caption">
          {t(
            'Please ensure you have selected a valid QR code from your Keystone device',
          )}
        </Typography>
      </Stack>
    </>
  );
};

const CameraBlockedMessage = () => {
  const { t } = useTranslation();

  return (
    <>
      <FiAlertCircle size={32} color="currentColor" />
      <Stack>
        <Typography variant="caption">
          {t('Access to camera has been blocked')}
        </Typography>
        <Typography variant="caption">
          {t('You must allow access to scan the QR code.')}
        </Typography>
      </Stack>
    </>
  );
};
