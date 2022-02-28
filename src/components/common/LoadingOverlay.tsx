import { LoadingSpinnerIcon, Overlay } from '@avalabs/react-components';
import { useTheme } from 'styled-components';

export function LoadingOverlay() {
  const theme = useTheme();

  return (
    <Overlay>
      <LoadingSpinnerIcon color={theme.colors.secondary1} />
    </Overlay>
  );
}
