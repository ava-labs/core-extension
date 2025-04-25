import { ContextContainer } from '@core/types';
import {
  useIsSpecificContextContainer,
} from './useIsSpecificContextContainer';

export function useAppDimensions(): { width: string; height: string } {
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const isFullscreen = useIsSpecificContextContainer(
    ContextContainer.FULLSCREEN,
  );

  if (isMiniMode) {
    return {
      height: '600px',
      width: '375px',
    };
  } else if (isConfirm) {
    return {
      height: '640px',
      width: '375px',
    };
  } else if (isFullscreen) {
    return {
      height: '100%',
      width: '100%',
    };
  }

  return {
    height: '',
    width: '',
  };
}
