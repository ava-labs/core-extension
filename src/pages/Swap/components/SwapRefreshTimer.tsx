import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useTranslation } from 'react-i18next';
import {
  InfoCircleIcon,
  Tooltip,
  Typography,
  Card,
} from '@avalabs/k2-components';

interface SwapRefreshTimerProps {
  secondsTimer: number;
  onExpire: () => void;
}

export function SwapRefreshTimer({
  secondsTimer,
  onExpire,
}: SwapRefreshTimerProps) {
  const { t } = useTranslation();
  const time = new Date();
  time.setSeconds(time.getSeconds() + secondsTimer);
  const { seconds, minutes, restart, isRunning } = useTimer({
    autoStart: true,
    expiryTimestamp: time,
    onExpire,
  });

  useEffect(() => {
    if (!isRunning) {
      const datetime = new Date();
      datetime.setSeconds(datetime.getSeconds() + secondsTimer);
      restart(datetime);
    }
  }, [isRunning, restart, secondsTimer]);

  const displayedSeconds = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const displayedMinutes = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 0.5,
        px: 1,
        overflow: 'initial',
      }}
      data-testid="swap-refresh-timer"
    >
      <Typography variant="caption" sx={{ mr: 1 }}>
        {displayedMinutes}:{displayedSeconds}
      </Typography>
      <Tooltip
        title={t('Quotes are refreshed to reflect current market prices')}
      >
        <InfoCircleIcon size="10px" />
      </Tooltip>
    </Card>
  );
}
