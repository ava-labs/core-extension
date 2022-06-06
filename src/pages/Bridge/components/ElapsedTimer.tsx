import { Typography } from '@avalabs/react-components';
import { useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import styled from 'styled-components';

const TimeElapsed = styled(Typography)<{
  complete: boolean;
}>`
  border-radius: 100px;
  padding: 4px 8px;
  font-size: 12px;
  font-weigth: 600;
  line-height: 16px;
  text-align: center;
  font-variant: tabular-nums;
  background-color: ${({ complete, theme }) =>
    complete ? theme.colors.success : theme.colors.bg3};
`;

const padTimeElapsed = (startTime: number, endTime?: number): Date => {
  // based on created time, set elapsed time offset

  const now = Date.now();
  const diff = (endTime || now) - startTime;
  const offset = new Date(now + diff);

  return offset;
};

export function ElapsedTimer({
  startTime,
  endTime,
}: {
  startTime: number;
  endTime?: number;
}) {
  const { hours, minutes, seconds, reset } = useStopwatch({
    autoStart: !endTime,
    offsetTimestamp: padTimeElapsed(startTime, endTime),
  });

  // Stop the timer when we know the endTime
  useEffect(() => {
    if (endTime) {
      reset(padTimeElapsed(startTime, endTime), false);
    }
    // Cannot add `reset` because it changes on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  const displayedSeconds = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const displayedMinutes = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const displayedHours = hours > 0 ? hours.toLocaleString('en-US') : undefined;

  return (
    <TimeElapsed complete={!!endTime}>
      {displayedHours && `${displayedHours}:`}
      {displayedMinutes}:{displayedSeconds}
    </TimeElapsed>
  );
}
