import { LoadingSpinnerIcon, Overlay } from '@avalabs/react-components';
import React from 'react';
import { useTheme } from 'styled-components';

export function LoadingOverlay() {
  const theme = useTheme();

  return (
    <Overlay>
      <LoadingSpinnerIcon color={theme.colors.primary1} />
    </Overlay>
  );
}
