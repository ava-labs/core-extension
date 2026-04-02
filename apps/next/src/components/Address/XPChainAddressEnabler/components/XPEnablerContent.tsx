import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Collapse, Stack } from '@avalabs/k2-alpine';

import { ImportMissingKeysStatus } from '../types';

import {
  ConnectYourKeystone,
  IncorrectDeviceError,
  ImportError,
  ImportingProgress,
  ConnectionError,
  ApproveConnection,
} from './ConnectionSteps';

const ContentByState: Record<ImportMissingKeysStatus, React.FC> = {
  waiting: ConnectYourKeystone,
  connected: ApproveConnection,
  'request-approved': ImportingProgress,
  'request-rejected': ConnectionError,
  importing: ImportingProgress,
  'incorrect-device-error': IncorrectDeviceError,
  'import-error': ImportError,
};

export const XPEnablerContent: FC<{
  status: ImportMissingKeysStatus;
  onRetry: () => void;
}> = ({ status, onRetry }) => {
  const { t } = useTranslation();

  const Content = ContentByState[status];

  const isRetryableError =
    status === 'request-rejected' ||
    status === 'incorrect-device-error' ||
    status === 'import-error';

  return (
    <Stack width="100%" flexGrow={1} justifyContent="space-between">
      <Stack
        px={6}
        gap={2}
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Content />
      </Stack>

      <Stack gap={1}>
        <Collapse in={isRetryableError}>
          <Button
            onClick={onRetry}
            fullWidth
            variant="contained"
            color="primary"
            size="extension"
          >
            {t('Try again')}
          </Button>
        </Collapse>
      </Stack>
    </Stack>
  );
};
