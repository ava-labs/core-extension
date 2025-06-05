import { AlertCircleIcon, Stack, useTheme } from '@avalabs/core-k2-components';

type DangerIconProps = {
  size?: number;
  innerBorderWidth?: number;
  outerBorderWidth?: number;
  borderGap?: number;
};

const DangerIcon = ({
  size = 72,
  innerBorderWidth = 14,
  outerBorderWidth = 2,
  borderGap = 5,
}: DangerIconProps) => {
  const theme = useTheme();
  const innerCircleSize = size - 2 * outerBorderWidth - 2 * borderGap;
  const iconSize = innerCircleSize - 2 * innerBorderWidth;

  return (
    <Stack
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${outerBorderWidth}px solid ${theme.palette.error.main}`,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',

        '&:after': {
          content: "''",
          border: `${innerBorderWidth + 1}px solid ${theme.palette.error.main}`,
          width: innerCircleSize,
          height: innerCircleSize,
          position: 'absolute',
          borderRadius: '50%',
        },
      }}
    >
      <AlertCircleIcon
        size={iconSize}
        color={theme.palette.common.white}
        fill={theme.palette.error.main}
      />
    </Stack>
  );
};

export default DangerIcon;
