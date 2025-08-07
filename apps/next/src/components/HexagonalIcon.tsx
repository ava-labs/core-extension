import { Box, useTheme, withSx } from '@avalabs/k2-alpine';
import { FC, PropsWithChildren } from 'react';

const NATURAL_WIDTH = 28;
const NATURAL_HEIGHT = 30;
const RATIO = NATURAL_WIDTH / NATURAL_HEIGHT;

const HEX_STYLES = {
  position: 'absolute',
};
const ICON_STYLES = {
  overflow: 'visible',
};
export const HexagonalIcon: FC<PropsWithChildren<{ size: number }>> = ({
  children,
  size,
}) => {
  return (
    <Box
      display="flex"
      position="relative"
      alignItems="center"
      justifyContent="center"
      width={size * RATIO}
      height={size}
      sx={{
        '& svg:last-child': ICON_STYLES,
      }}
    >
      <HexagonShape size={size} sx={HEX_STYLES} />
      {children}
    </Box>
  );
};

const HexagonShape = withSx(({ size }: { size: number }) => {
  const theme = useTheme();

  const height = size;
  const width = height * RATIO;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${NATURAL_WIDTH} ${NATURAL_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1.3094C12.4752 -0.119661 15.5248 -0.119661 18 1.3094L23.8564 4.6906C26.3316 6.11966 27.8564 8.76068 27.8564 11.6188V18.3812C27.8564 21.2393 26.3316 23.8803 23.8564 25.3094L18 28.6906C15.5248 30.1197 12.4752 30.1197 10 28.6906L4.14359 25.3094C1.66839 23.8803 0.143594 21.2393 0.143594 18.3812V11.6188C0.143594 8.76068 1.66839 6.11966 4.14359 4.6906L10 1.3094Z"
        fill={theme.palette.text.primary}
        fillOpacity="0.1"
      />
      <path
        d="M10.25 1.74219C12.4981 0.444285 15.2516 0.404124 17.5312 1.62109L17.75 1.74219L23.6064 5.12402C25.9268 6.4638 27.3564 8.93973 27.3564 11.6191V18.3809C27.3564 21.0603 25.9268 23.5362 23.6064 24.876L17.75 28.2578C15.5019 29.5557 12.7484 29.5959 10.4688 28.3789L10.25 28.2578L4.39355 24.876C2.07317 23.5362 0.643555 21.0603 0.643555 18.3809V11.6191C0.643555 8.93973 2.07317 6.4638 4.39355 5.12402L10.25 1.74219Z"
        stroke={theme.palette.text.primary}
        strokeOpacity="0.1"
      />
    </svg>
  );
});
