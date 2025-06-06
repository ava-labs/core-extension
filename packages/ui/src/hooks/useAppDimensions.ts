import { ContextContainer } from '@core/types';
import { isSpecificContextContainer } from '../utils/isSpecificContextContainer';

type AppDimensions = {
  width: string;
  height: string;
};

const dimensions = {
  miniMode: { width: '375px', height: '600px' },
  confirm: { width: '375px', height: '640px' },
  fullscreen: { width: '100%', height: '100%' },
  unknown: { width: '', height: '' },
} as const satisfies Record<string, AppDimensions>;

export function useAppDimensions(): AppDimensions {
  const isConfirm = isSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = isSpecificContextContainer(ContextContainer.POPUP);
  const isFullscreen = isSpecificContextContainer(ContextContainer.FULLSCREEN);

  if (isMiniMode) {
    return dimensions.miniMode;
  } else if (isConfirm) {
    return dimensions.confirm;
  } else if (isFullscreen) {
    return dimensions.fullscreen;
  }

  return dimensions.unknown;
}
