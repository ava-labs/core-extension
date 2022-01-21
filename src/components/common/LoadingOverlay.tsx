import { LoadingSpinnerIcon, Overlay } from '@avalabs/react-components';
import { useTheme } from 'styled-components';

export function LoadingOverlay() {
  const theme = useTheme();

  return (
    <Overlay>
      <LoadingSpinnerIcon color={theme.colors.primary1} />
    </Overlay>
  );
}
