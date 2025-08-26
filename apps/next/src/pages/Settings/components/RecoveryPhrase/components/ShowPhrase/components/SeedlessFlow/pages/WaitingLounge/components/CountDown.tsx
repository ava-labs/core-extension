import { ArcProgress } from '@/components/ArcProgress';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { ExportState } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  progress: number;
  timeLeft: string;
  onCancel: () => void;
  fullScreen: boolean;
  state: Extract<ExportState, ExportState.Pending | ExportState.Cancelling>;
};

export const CountDown: FC<Props> = ({
  progress,
  timeLeft,
  onCancel,
  fullScreen,
  state,
}) => {
  const { t } = useTranslation();
  const isCancelling = state === ExportState.Cancelling;
  return (
    <>
      <Stack
        position="relative"
        my="auto"
        mx="auto"
        alignItems="center"
        justifyContent="center"
      >
        <ArcProgress
          size={190 * (fullScreen ? 1.5 : 1)}
          value={progress}
          color="success"
        />
        <Box
          position="absolute"
          bottom={fullScreen ? 12 : 2}
          textAlign="center"
          width={1}
          px={fullScreen ? 5 : 3}
        >
          <Typography
            variant={fullScreen ? 'h5' : 'caption'}
            color="text.primary"
          >
            {state === ExportState.Cancelling
              ? t('Your request has been cancelled')
              : t("Your wallet's recovery phrase will be visible in")}
          </Typography>
          <Typography
            variant="h2"
            fontWeight="bold"
            color="text.primary"
            textAlign="center"
          >
            {timeLeft
              .replace(/hours?/, 'hr')
              .replace(/minutes?/, 'mn')
              .replace('less than a', '< 1') || <CircularProgress size="1em" />}
          </Typography>
        </Box>
      </Stack>
      <Button
        variant="contained"
        size={fullScreen ? 'large' : 'extension'}
        fullWidth
        color="secondary"
        onClick={onCancel}
        disabled={isCancelling}
        loading={isCancelling}
      >
        {isCancelling ? t('Cancelling...') : t('Cancel request')}
      </Button>
    </>
  );
};
