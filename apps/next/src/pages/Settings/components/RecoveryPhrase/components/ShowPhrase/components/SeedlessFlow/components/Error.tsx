import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { ExportErrorCode } from '@core/ui';
import { FC } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { MdCrisisAlert } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { StageProps } from '../types';
import { OmniViewPage } from './OmniViewPage';

const getErrorContent = (
  error: ExportErrorCode | undefined,
  t: TFunction,
  initExport: VoidFunction,
  goToSettings: VoidFunction,
) => {
  switch (error) {
    case ExportErrorCode.RequestOutdated:
      return {
        title: t('Request Outdated'),
        description: t('Your export request has expired. Please try again.'),
        buttonText: t('Try again'),
        buttonAction: initExport,
      };
    case ExportErrorCode.FailedToInitialize:
      return {
        title: t('Failed to Initialize'),
        description: t(
          'Unable to start the export process. Please try again later.',
        ),
        buttonText: t('Try again'),
        buttonAction: initExport,
      };
    case ExportErrorCode.FailedToComplete:
      return {
        title: t('Export Failed'),
        description: t(
          'The export process could not be completed. Please try again.',
        ),
        buttonText: t('Try again'),
        buttonAction: initExport,
      };
    case ExportErrorCode.FailedToCancel:
      return {
        title: t('Cancellation Failed'),
        description: t(
          'Unable to cancel the export request. Please contact support.',
        ),
        buttonText: t('Close'),
        buttonAction: goToSettings,
      };
    default:
      return {
        title: t('Unknown Error'),
        description: t(
          'An unexpected error occurred. Please try again later or contact Core support.',
        ),
        buttonText: t('Close'),
        buttonAction: goToSettings,
      };
  }
};

export const Error: FC<StageProps> = ({ error, initExport, fullscreen }) => {
  const { t } = useTranslation();
  const { replace } = useHistory();

  const goToSettings = () => {
    replace('/settings');
    window.close();
  };

  const { title, description, buttonText, buttonAction } = getErrorContent(
    error,
    t,
    initExport,
    goToSettings,
  );

  return (
    <OmniViewPage fullscreen={fullscreen} title={title}>
      <Stack gap={3} height={1} alignItems="center">
        <Stack
          alignItems="center"
          gap={2}
          py={4}
          flexGrow={1}
          justifyContent="center"
        >
          <MdCrisisAlert size={48} color="error.light" />
          <Typography variant="body1" color="text.secondary" textAlign="center">
            {description}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          onClick={buttonAction}
          fullWidth
          sx={{ mt: 'auto' }}
        >
          {buttonText}
        </Button>
      </Stack>
    </OmniViewPage>
  );
};
