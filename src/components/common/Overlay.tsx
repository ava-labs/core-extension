import { ReactNode } from 'react';
import { Backdrop, useTheme } from '@avalabs/k2-components';

interface OverlayProps {
  children: ReactNode;
  isBackgroundFilled?: boolean;
}

export const Overlay = ({ children, isBackgroundFilled }: OverlayProps) => {
  const theme = useTheme();
  const backgroundStyles = isBackgroundFilled
    ? {
        backdropFilter: 'none',
        backgroundColor: theme.palette.background.default,
      }
    : {
        backdropFilter: 'blur(30px)',
        backgroundColor: 'transparent',
      };

  return (
    <Backdrop
      open
      sx={{
        zIndex: 10,
        ...backgroundStyles,
      }}
    >
      {children}
    </Backdrop>
  );
};
