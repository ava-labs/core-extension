import {
  Button,
  Stack,
  Typography,
  useTheme,
  CircularProgress,
  QRCodeIcon,
  CameraBlockedIcon,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { AnimatedQRScanner, Purpose, URType } from '@keystonehq/animated-qr';

export const useKeystoneScannerContents = ({
  cameraPermission,
  hasError,
  setHasError,
  handleScan,
  handleError,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();

  const headLines = {
    allowAccess: t('Camera Access'),
    hasAccess: t('Scan QR Code'),
    blockedAccess: t('Access Blocked'),
    hasError: t('Invalid QR Code'),
  };

  const descriptions = {
    allowAccess: t('Allow Chrome access to your camera to scan the QR Code'),
    hasAccess: t('Scan the QR code displayed on your Keystone device'),
    blockedAccess: t(
      'You’ve blocked access to your camera. Please allow access to continue.'
    ),
    hasError: t(
      'Please ensure you have selected a valid QR code from your Keystone device. '
    ),
  };

  const helperTexts = {
    allowAccess: (
      <Typography
        align="center"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {t(
          'If you block access, look in the top right corner of your browser to enable camera access'
        )}
      </Typography>
    ),
    hasAccess: (
      <Typography
        align="center"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {t(
          'Position the QR code in front of your camera. The screen is blurred, but this will not affect the scan.'
        )}
      </Typography>
    ),
    blockedAccess: (
      <Typography
        align="center"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {t(
          'If you block access, look in the top right corner of your browser to enable camera access'
        )}
      </Typography>
    ),
    hasError: (
      <Stack sx={{ alignItems: 'center' }}>
        <Button
          data-testid="try-again-button"
          onClick={() => {
            setHasError(false);
          }}
          sx={{ width: '246px' }}
        >
          {t('Try Again')}
        </Button>
      </Stack>
    ),
  };

  const contents = {
    allowAccess: (
      <>
        <CircularProgress size={88} />
        <AnimatedQRScanner
          purpose={Purpose.SOL_SYNC}
          handleScan={handleScan}
          handleError={handleError}
          options={{
            width: 1,
            height: 1,
          }}
        />
      </>
    ),
    hasAccess: (
      <AnimatedQRScanner
        purpose={Purpose.SYNC}
        handleScan={handleScan}
        handleError={handleError}
        options={{
          width: 229,
          height: 229,
        }}
        urTypes={[URType.CRYPTO_MULTI_ACCOUNTS]}
      />
    ),
    blockedAccess: (
      <CameraBlockedIcon
        size={50}
        sx={{
          outline: `3px solid ${palette.error.main}`,
          outlineOffset: 5,
          backgroundColor: 'error.main',
          m: 1,
          p: 2,
          borderRadius: 999,
          border: 1,
          borderColor: 'error.main',
        }}
      />
    ),
    hasError: (
      <QRCodeIcon
        size={56}
        sx={{
          outline: `3px solid ${palette.error.main}`,
          outlineOffset: 5,
          backgroundColor: 'error.main',
          m: 1,
          p: 2,
          borderRadius: 999,
          border: 1,
          borderColor: 'error.main',
        }}
      />
    ),
  };

  const getPageContent = () => {
    if (!cameraPermission || cameraPermission === 'prompt') {
      return {
        headLine: headLines.allowAccess,
        description: descriptions.allowAccess,
        content: contents.allowAccess,
        helperText: helperTexts.allowAccess,
      };
    }
    if (cameraPermission === 'granted' && hasError) {
      return {
        headLine: headLines.hasError,
        description: descriptions.hasError,
        content: contents.hasError,
        helperText: helperTexts.hasError,
      };
    }
    if (cameraPermission === 'granted') {
      return {
        headLine: headLines.hasAccess,
        description: descriptions.hasAccess,
        content: contents.hasAccess,
        helperText: helperTexts.hasAccess,
      };
    }

    if (cameraPermission === 'denied') {
      return {
        headLine: headLines.blockedAccess,
        description: descriptions.blockedAccess,
        content: contents.blockedAccess,
        helperText: helperTexts.blockedAccess,
      };
    }
  };

  return getPageContent();
};
