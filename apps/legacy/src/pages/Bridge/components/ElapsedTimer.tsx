import {
  CheckIcon,
  InfoCircleIcon,
  Stack,
  Tooltip,
  Typography,
  styled,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';

const TimeElapsed = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'complete',
})<{
  complete?: boolean;
}>`
  min-width: 76px; // this prevents the chip growing and shrinking due to numbers changing
  border-radius: 66px;
  padding: 2px 8px;
  text-align: center;
  background-color: ${({ complete, theme }) =>
    complete ? theme.palette.success.dark : theme.palette.grey[700]};
`;

const padTimeElapsed = (startTime: number, endTime?: number): Date => {
  // based on created time, set elapsed time offset

  const now = Date.now();
  const diff = (endTime || now) - startTime;
  const offset = new Date(now + diff);

  return offset;
};

export function ElapsedTimer({
  offloadDelayTooltip,
  startTime,
  endTime,
  hasError,
}: {
  offloadDelayTooltip?: React.ReactNode;
  startTime: number;
  endTime?: number;
  hasError?: boolean;
}) {
  const { t } = useTranslation();
  const { hours, minutes, seconds, reset, isRunning } = useStopwatch({
    autoStart: false,
    offsetTimestamp: padTimeElapsed(startTime, endTime),
  });

  // Start the timer when we have a startTime but no endTime yet
  useEffect(() => {
    if (startTime && !endTime && !isRunning) {
      reset(padTimeElapsed(startTime, endTime), true);
    }
  }, [endTime, startTime, reset, isRunning]);

  // Stop the timer when endTime becomes available (bridge completed)
  useEffect(() => {
    if (endTime && isRunning) {
      // Reset to final elapsed time and pause
      reset(padTimeElapsed(startTime, endTime), false);
    }
  }, [endTime, startTime, reset, isRunning]);

  const displayedSeconds = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const displayedMinutes = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const displayedHours = hours > 0 ? hours.toLocaleString('en-US') : undefined;

  if (!startTime) {
    return (
      <TimeElapsed complete={!!endTime}>
        <Typography>00:00</Typography>
      </TimeElapsed>
    );
  }

  return (
    <TimeElapsed
      complete={!!endTime && !hasError}
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: hasError ? 'center' : 'space-between',
      }}
    >
      <Typography>
        {displayedHours && `${displayedHours}:`}
        {displayedMinutes}:{displayedSeconds}
      </Typography>
      {endTime ? (
        hasError ? null : (
          <CheckIcon size="12" sx={{ ml: 0.5 }} />
        )
      ) : (
        (offloadDelayTooltip ?? (
          <Tooltip title={t('Time Elapsed')}>
            <InfoCircleIcon />
          </Tooltip>
        ))
      )}
    </TimeElapsed>
  );
}
