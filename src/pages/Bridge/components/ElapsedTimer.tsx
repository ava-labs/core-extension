import { Typography } from '@avalabs/react-components';
import { useStopwatch } from 'react-timer-hook';
import styled from 'styled-components';

const TimeElapsed = styled(Typography)`
  background-color: ${({ theme }) => `${theme.palette.white}26`};
  border-radius: 100px;
  padding: 4px 8px;
  font-size: 12px;
  font-weigth: 600;
  line-height: 16px;
  text-align: center;
  font-variant: tabular-nums;
`;

const padTimeElapsed = (createdDate: Date) => {
  // based on created time, set elapsed time offset

  const startDate = new Date(createdDate);
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();
  const offset = new Date(now.setTime(now.getTime() + diff));

  return offset;
};

export function ElapsedTimer({ startTime }: { startTime: Date }) {
  const { minutes, seconds } = useStopwatch({
    autoStart: true,
    offsetTimestamp: startTime ? padTimeElapsed(startTime) : undefined,
  });

  const displayedSeconds = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const displayedMinutes = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });

  return (
    <TimeElapsed>
      {displayedMinutes}:{displayedSeconds}
    </TimeElapsed>
  );
}
