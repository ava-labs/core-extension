import { useEffect } from 'react';
import {
  InfoIcon,
  Card,
  Tooltip,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTimer } from 'react-timer-hook';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

const TimerContainer = styled.div`
  border-radius: 100px;
`;

interface SwapRefreshTimerProps {
  secondsTimer: number;
  onExpire: () => void;
}

export function SwapRefreshTimer({
  secondsTimer,
  onExpire,
}: SwapRefreshTimerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const time = new Date();
  time.setSeconds(time.getSeconds() + secondsTimer);
  const { seconds, minutes, restart, isRunning } = useTimer({
    autoStart: true,
    expiryTimestamp: time,
    onExpire,
  });

  useEffect(() => {
    if (!isRunning) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + secondsTimer);
      restart(time);
    }
  }, [isRunning, restart, secondsTimer]);

  const displayedSeconds = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const displayedMinutes = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  const Content = (
    <VerticalFlex width="240px">
      <Typography size={12} height="1.5">
        {t('Quotes are refreshed to reflect current market prices')}
      </Typography>
    </VerticalFlex>
  );
  return (
    <TimerContainer data-testid="swap-refresh-timer">
      <Card padding="4px 8px">
        <Typography size={12} height="16px" margin=" 0 7px 0 0 " width="34px">
          {displayedMinutes}:{displayedSeconds}
        </Typography>
        <Tooltip content={Content}>
          <InfoIcon height="16px" color={theme.colors.text2} />
        </Tooltip>
      </Card>
    </TimerContainer>
  );
}
