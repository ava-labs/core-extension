import { Fragment, memo, useRef } from 'react';
import { Box, styled, Theme, Typography } from '@avalabs/core-k2-components';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';

const pulseStart = 'rgba(232, 232, 232, 0.7)';
const pulseEnd = 'rgba(232, 232, 232, 0)';
const pulse = () => keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 ${pulseStart};
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px ${pulseEnd};
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 ${pulseEnd};
  }
`;

const move = keyframes`
  0% {
    left: -6px;
  }

  100% {
    left: 100%;
  }
`;

const Line: any = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'complete' && prop !== 'active' && prop !== 'grow',
})(
  ({
    active,
    complete,
    theme,
    width,
    grow,
  }: {
    active: boolean;
    complete: boolean;
    grow?: boolean;
    theme: Theme;
    width: number;
  }) => ({
    width: grow ? '100%' : `${width}px`,
    height: 2,
    marginTop: 9,
    position: 'relative',
    background:
      active || complete ? theme.palette.text.primary : theme.palette.divider,
    transition: 'background-color 500ms',
  }),
);

const Dot: any = styled('div')(({ theme, delay }: any) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: theme.palette.secondary.main,
  position: 'absolute',
  top: -3,
  left: -6,
  animation: `${move} 1.6s infinite ease-in`,
  animationDelay: `${delay}s`,
}));

const Circle: any = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'labelBackgroundColor' && prop !== 'complete' && prop !== 'active',
})(({ complete, active, theme, labelBackgroundColor }: any) => ({
  display: 'flex',
  border: `3px solid ${theme.palette.primary.main}`,
  background: complete
    ? theme.palette.secondary.main
    : labelBackgroundColor || theme.palette.background.paper,
  borderRadius: '50%',
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background-color 500ms',
  zIndex: 2,
  animation: active ? `${pulse()} 1.6s infinite` : 'unset',
}));

const Label = styled(Typography)(() => ({
  position: 'absolute',
  top: 10,
  left: '50%',
  transform: 'translateX(-50%)',
}));

const StartLabel = styled(Label, {
  shouldForwardProp: (prop) => prop !== 'labelBackgroundColor',
})(({ theme }) => ({
  left: 0,
  transform: 'unset',
  zIndex: 1,
  paddingRight: 8,
  backgroundColor: theme.palette.grey[850],
}));

const FinishLabel = styled(Label, {
  shouldForwardProp: (prop) => prop !== 'labelBackgroundColor',
})(({ theme }) => ({
  right: 0,
  left: 'unset',
  zIndex: 1,
  paddingLeft: 8,
  transform: 'unset',
  backgroundColor: theme.palette.grey[850],
}));

const DashedLine: any = styled('div', {
  shouldForwardProp: (prop) => prop !== 'labelBackgroundColor',
})(({ theme, labelBackgroundColor }: any) => ({
  width: 40,
  height: 0,
  backgroundColor: labelBackgroundColor || theme.palette.background.default,
  position: 'absolute',
  left: 20,
  top: 9,
  borderTop: `2px dashed ${theme.palette.text.primary}`,
  zIndex: 1,
}));

const Slider: any = styled('div')(({ left }: { left: number }) => ({
  position: 'absolute',
  display: 'flex',
  left: left,
  transition: 'left 500ms ease-in-out',
  minWidth: '100%',
}));

export type ConfirmationTrackerProps = {
  className?: string;
  currentCount: number;
  labelBackgroundColor?: string;
  requiredCount: number;
  started: boolean;
};

export const ConfirmationTracker = memo(function ConfirmationTracker({
  labelBackgroundColor = '#000',
  started,
  requiredCount,
  currentCount,
  ...props
}: ConfirmationTrackerProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  const numberOfDots = requiredCount - 1;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const containerRef = useRef<HTMLDivElement>(null);
  const dots: JSX.Element[] = [];
  let left = 0;

  const calculateLineWidth = () => {
    const containerWidth = containerRef.current?.clientWidth;

    if (!containerWidth) {
      return numberOfDots === 1 ? 125 : 90;
    }

    const divider = numberOfDots < 3 ? 2 : 3;
    const multiplier = numberOfDots < 3 ? 3 : 4;

    return (containerWidth - multiplier * 20) / divider;
  };

  const renderLine = (complete: boolean, active: boolean, grow = false) => (
    <Line
      width={calculateLineWidth()}
      complete={complete}
      active={active}
      grow={grow}
    >
      {active && (
        <>
          <Dot />
          <Dot delay={0.45} />
          <Dot delay={0.9} />
        </>
      )}
    </Line>
  );

  for (let i = 1; i <= numberOfDots; i++) {
    const active = started && currentCount < i && currentCount >= i - 1;
    dots.push(
      <Fragment key={`container-${i}`}>
        {renderLine(currentCount >= i, active)}
        <Box
          display="flex"
          direction="column"
          align="center"
          position="relative"
        >
          <Circle
            complete={currentCount >= i}
            active={active}
            labelBackgroundColor={labelBackgroundColor}
          />
          <Label margin="25px 0 0" size={14}>
            {i}/{requiredCount}
          </Label>
        </Box>
      </Fragment>,
    );
  }

  const lastStepActive =
    started && currentCount < requiredCount && currentCount >= numberOfDots;
  const showBreakEnd = currentCount < requiredCount - 2 && requiredCount > 3;

  if (currentCount > 1 && requiredCount > 2) {
    if (!showBreakEnd) {
      left = -(calculateLineWidth() + 20) * (requiredCount - 3);
    } else {
      left = -(calculateLineWidth() + 20) * (currentCount - 1);
    }
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        minWidth: 311,
        maxWidth: '100%',
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '10px',
          position: 'relative',
        }}
      >
        <Circle
          complete={started}
          active={false}
          labelBackgroundColor={labelBackgroundColor}
        />
        <StartLabel
          labelBackgroundColor={labelBackgroundColor}
          margin="25px 0 0 0"
          size={14}
        >
          {t('Start')}
        </StartLabel>
        {currentCount > 1 && (
          <DashedLine labelBackgroundColor={labelBackgroundColor} />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          flexGrow: 1,
          height: 63,
          p: '10px 0 0 0',
        }}
      >
        <Slider left={`${left}px`}>
          {dots}
          {renderLine(
            currentCount >= requiredCount,
            lastStepActive,
            requiredCount === 1,
          )}
        </Slider>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '10px',
          position: 'relative',
        }}
      >
        <Circle
          complete={currentCount >= requiredCount}
          active={lastStepActive}
        />
        <FinishLabel margin="25px 0 0 0" size={14}>
          {t('Final')}
        </FinishLabel>
      </Box>
    </Box>
  );
});
