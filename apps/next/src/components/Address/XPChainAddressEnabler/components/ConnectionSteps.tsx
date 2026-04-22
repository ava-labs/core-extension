import { FC, useCallback, useEffect, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';

import { PendingKeystoneCircles } from '@/components/PendingCircles';
import { ContextContainer } from '@core/types';
import {
  isSpecificContextContainer,
  useAnalyticsContext,
  useKeystoneUsbContext,
} from '@core/ui';
import { tabs } from 'webextension-polyfill';

const NormalMessage: FC<{ message: string; icon: React.ReactNode }> = ({
  message,
  icon,
}) => (
  <Stack gap={4} alignItems="center" justifyContent="center">
    {icon}
    <Typography variant="body3" color="text.secondary">
      {message}
    </Typography>
  </Stack>
);

const WAITING_FOR_TOO_LONG_TIMEOUT = 20_000;

export const ConnectYourKeystone = () => {
  const { t } = useTranslation();
  const { popDeviceSelection, initKeystoneTransport } = useKeystoneUsbContext();
  const { captureEncrypted } = useAnalyticsContext();

  const [isWaitingForTooLong, setIsWaitingForTooLong] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsWaitingForTooLong(true);
    }, WAITING_FOR_TOO_LONG_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [setIsWaitingForTooLong]);

  const onReconnect = useCallback(async () => {
    captureEncrypted('EnableAddress_Reconnect_Clicked', {
      chain: 'xp',
      device: 'keystone_usb',
    });

    if (isSpecificContextContainer(ContextContainer.CONFIRM)) {
      await popDeviceSelection();
    } else {
      // Open in a full screen tab, the extension window does not support the device selection popup.
      const tab = await tabs.create({
        url: '/fullscreen.html#/keystone-usb/reconnect',
      });

      const initTransport = (tabId) => {
        if (tabId === tab.id) {
          initKeystoneTransport();
        }

        tabs.onRemoved.removeListener(initTransport);
      };

      tabs.onRemoved.addListener(initTransport);
    }
  }, [popDeviceSelection, initKeystoneTransport, captureEncrypted]);

  return (
    <>
      <NormalMessage
        message={t('Please connect your Keystone device.')}
        icon={<PendingKeystoneCircles startImmediately />}
      />
      <Collapse in={isWaitingForTooLong}>
        <Button variant="text" onClick={onReconnect} fullWidth size="small">
          {t('Unable to connect?')}
        </Button>
      </Collapse>
    </>
  );
};

export const ApproveConnection = () => {
  const { t } = useTranslation();

  return (
    <NormalMessage
      message={t(
        'Please approve the connection request on your Keystone device.',
      )}
      icon={<PendingKeystoneCircles startImmediately />}
    />
  );
};

export const ImportingProgress = () => {
  const { t } = useTranslation();

  return (
    <NormalMessage
      message={t('Importing addresses...')}
      icon={<CircularProgress size={50} />}
    />
  );
};

const ErrorMessage: FC<{ error: string }> = ({ error }) => (
  <Stack gap={2}>
    <Box flexShrink={0} color="error.main">
      <FiAlertCircle size={24} />
    </Box>
    <Typography variant="body3" color="error">
      {error}
    </Typography>
  </Stack>
);

export const ConnectionError = () => {
  const { t } = useTranslation();

  return <ErrorMessage error={t('We failed to connect to Keystone device')} />;
};

export const ImportError = () => {
  const { t } = useTranslation();

  return (
    <ErrorMessage
      error={t('We failed to import missing public keys from Keystone')}
    />
  );
};

export const IncorrectDeviceError = () => {
  const { t } = useTranslation();

  return (
    <ErrorMessage
      error={t(
        'The current wallet was not imported using this Keystone device. Please connect the original Keystone device to continue.',
      )}
    />
  );
};
