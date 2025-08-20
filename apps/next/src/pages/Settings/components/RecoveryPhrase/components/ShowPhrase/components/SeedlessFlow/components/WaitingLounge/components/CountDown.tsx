import { ArcProgress } from '@/components/ArcProgress';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  progress: number;
  timeLeft: string;
  onCancel: () => void;
};

export const CountDown: FC<Props> = ({ progress, timeLeft, onCancel }) => {
  const { t } = useTranslation();

  return (
    <>
      <Stack
        position="relative"
        my="auto"
        mx="auto"
        alignItems="center"
        justifyContent="center"
      >
        <ArcProgress size={190} value={progress} color="success" />
        <Box position="absolute" bottom={2} textAlign="center" width={1} px={3}>
          <Typography variant="caption" color="text.primary">
            {t("Your wallet's recovery phrase will be visible in")}
          </Typography>
          <Typography
            variant="h2"
            fontWeight="bold"
            color="text.primary"
            textAlign="center"
          >
            {timeLeft.replace(/hours?/, 'hr').replace(/minutes?/, 'mn') || (
              <CircularProgress size="1em" />
            )}
          </Typography>
        </Box>
      </Stack>
      <Button
        variant="contained"
        size="extension"
        fullWidth
        color="secondary"
        onClick={onCancel}
      >
        {t('Cancel request')}
      </Button>
    </>
  );
};
