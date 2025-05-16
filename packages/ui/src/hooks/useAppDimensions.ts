import { ContextContainer } from '@core/types';
import { useIsSpecificContextContainer } from './useIsSpecificContextContainer';

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
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const isFullscreen = useIsSpecificContextContainer(
    ContextContainer.FULLSCREEN,
  );

  if (isMiniMode) {
    return dimensions.miniMode;
  } else if (isConfirm) {
    return dimensions.confirm;
  } else if (isFullscreen) {
    return dimensions.fullscreen;
  }

  return dimensions.unknown;
}
