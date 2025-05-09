import { ReactNode } from 'react';
import {
  Backdrop,
  BackdropProps,
  SxProps,
  Theme,
  useTheme,
} from '@avalabs/core-k2-components';

interface OverlayProps {
  children: ReactNode;
  isBackgroundFilled?: boolean;
  sx?: SxProps<Theme>;
}

export const Overlay = ({
  children,
  isBackgroundFilled,
  sx,
  ...props
}: OverlayProps & Omit<BackdropProps, 'open'>) => {
  const theme = useTheme();
  const backgroundStyles = isBackgroundFilled
    ? {
        backdropFilter: 'none',
        backgroundColor: theme.palette.background.default,
      }
    : {
        backdropFilter: 'blur(12.5px)',
        backgroundColor: 'transparent',
      };

  return (
    <Backdrop
      open
      sx={[
        {
          zIndex: 10,
          ...backgroundStyles,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {children}
    </Backdrop>
  );
};
