import { Button, Stack } from '@avalabs/k2-alpine';
import { tabs } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import React, { FC, useCallback } from 'react';

import { ContextContainer } from '@core/types';
import { isSpecificContextContainer, useKeystoneUsbContext } from '@core/ui';

import { ImportMissingKeysStatus } from '../types';

import {
  ConnectYourKeystone,
  ConnectionError,
  IncorrectDeviceError,
  ImportError,
  ImportingProgress,
} from './Styled';

const ContentByState: Record<ImportMissingKeysStatus, React.FC> = {
  idle: ConnectYourKeystone,
  initialized: ConnectYourKeystone,
  connecting: ConnectYourKeystone,
  connected: ConnectYourKeystone,
  importing: ImportingProgress,
  'verifying-device': ImportingProgress,
  success: () => null,
  'connection-error': ConnectionError,
  'incorrect-device': IncorrectDeviceError,
  'import-error': ImportError,
};

export const XPEnablerContent: FC<{
  status: ImportMissingKeysStatus;
  onImportClick: () => void;
}> = ({ status, onImportClick }) => {
  const { t } = useTranslation();
  const { popDeviceSelection, initKeystoneTransport } = useKeystoneUsbContext();

  const Content = ContentByState[status];

  const onReconnect = useCallback(async () => {
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
  }, [popDeviceSelection, initKeystoneTransport]);

  const isConnecting = status === 'initialized' || status === 'connecting';
  const isError = status.endsWith('-error') || status === 'incorrect-device';
  const isImporting = status === 'importing' || status === 'verifying-device';

  return (
    <Stack width="100%" flexGrow={1} justifyContent="space-between">
      <Stack
        px={6}
        gap={4}
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Content />
      </Stack>

      <Stack gap={1}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="extension"
          onClick={onImportClick}
          disabled={isConnecting || isImporting}
          loading={isConnecting || isImporting}
        >
          {isError ? t('Try again') : t('Import addresses')}
        </Button>

        {isError && (
          <Button
            onClick={onReconnect}
            fullWidth
            variant="contained"
            color="secondary"
            size="extension"
          >
            {t('Unable to connect?')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
