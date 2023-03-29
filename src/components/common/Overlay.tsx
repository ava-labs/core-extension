import { ReactNode } from 'react';
import { Backdrop } from '@avalabs/k2-components';

interface OverlayProps {
  children: ReactNode;
}

export const Overlay = ({ children }: OverlayProps) => {
  return (
    <Backdrop open sx={{ zIndex: 10, backdropFilter: 'blur(30px)' }}>
      {children}
    </Backdrop>
  );
};
