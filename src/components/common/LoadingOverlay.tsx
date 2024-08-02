import { CircularProgress } from '@avalabs/core-k2-components';
import { Overlay } from './Overlay';

export function LoadingOverlay() {
  return (
    <Overlay>
      <CircularProgress />
    </Overlay>
  );
}
