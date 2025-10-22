import { FC } from 'react';
import { styled } from '@avalabs/k2-alpine';

type Props = {
  verticalLines: number[];
  horizontalLines: number[];
};

export const TestnetModeOverlay: FC<Props> = ({
  verticalLines,
  horizontalLines,
}) => {
  return (
    <>
      {verticalLines.map((offset) => (
        <VLine
          key={offset}
          sx={{
            left: offset < 0 ? `calc(100vw + ${offset}px)` : `${offset}px`,
          }}
        />
      ))}
      {horizontalLines.map((offset) => (
        <HLine
          key={offset}
          sx={{
            top: offset < 0 ? `calc(100vw + ${offset}px)` : `${offset}px`,
          }}
        />
      ))}
    </>
  );
};

const Line = styled('div')(({ theme }) => ({
  position: 'fixed',
  pointerEvents: 'none',
  backgroundColor: theme.palette.divider,
  zIndex: 10000,
  left: 0,
  top: 0,
}));

const VLine = styled(Line)({
  width: '1px',
  height: '100vh',
});

const HLine = styled(Line)({
  width: '100vw',
  height: '1px',
});
