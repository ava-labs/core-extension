import { Stack, styled, Tooltip, Typography } from '@avalabs/k2-alpine';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStopwatch } from 'react-timer-hook';
import { MdCheckCircle as CheckIcon, MdInfo as InfoIcon } from 'react-icons/md';

const TimeElapsed = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'complete',
})<{
  complete?: boolean;
}>(({ complete, theme }) => ({
  minWidth: 76, // this prevents the chip growing and shrinking due to numbers changing
  borderRadius: 66,
  padding: '2px 8px',
  textAlign: 'center',
  backgroundColor: complete
    ? theme.palette.success.dark
    : theme.palette.grey[700],
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const padTimeElapsed = (startTime: number, endTime?: number): Date => {
  // based on created time, set elapsed time offset
  const now = Date.now();
  const diff = (endTime || now) - startTime;
  const offset = new Date(now + diff);

  return offset;
};

type Props = {
  offloadDelayTooltip?: React.ReactNode;
  startTime: number;
  endTime?: number;
  hasError?: boolean;
};

export const ElapsedTimer: FC<Props> = ({
  offloadDelayTooltip,
  startTime,
  endTime,
  hasError,
}) => {
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
        <Typography variant="body3">00:00</Typography>
      </TimeElapsed>
    );
  }

  return (
    <TimeElapsed complete={!!endTime && !hasError}>
      <Typography variant="body3">
        {displayedHours && `${displayedHours}:`}
        {displayedMinutes}:{displayedSeconds}
      </Typography>
      {endTime ? (
        hasError ? null : (
          <CheckIcon size={12} style={{ marginLeft: 4 }} />
        )
      ) : (
        (offloadDelayTooltip ?? (
          <Tooltip title={t('Time Elapsed')}>
            <InfoIcon size={12} style={{ marginLeft: 4 }} />
          </Tooltip>
        ))
      )}
    </TimeElapsed>
  );
};
