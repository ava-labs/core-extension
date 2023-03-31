import { CircularProgress } from '@avalabs/k2-components';
import { Overlay } from './Overlay';

export function LoadingOverlay() {
  return (
    <Overlay>
      <CircularProgress />
    </Overlay>
  );
}
