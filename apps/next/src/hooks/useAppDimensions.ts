import { ContextContainer } from '@core/types';
import { isSpecificContextContainer } from '@core/ui';

type AppDimensions = {
  width: string;
  height: string;
};

const dimensions = {
  miniMode: { width: '320px', height: '600px' },
  confirm: { width: '320px', height: '900px' },
  fullscreen: { width: '100%', height: '100%' },
  unknown: { width: '', height: '' },
} as const satisfies Record<string, AppDimensions>;

export function useAppDimensions(): AppDimensions {
  if (isSpecificContextContainer(ContextContainer.POPUP)) {
    return dimensions.miniMode;
  }

  if (isSpecificContextContainer(ContextContainer.CONFIRM)) {
    return dimensions.confirm;
  }

  if (isSpecificContextContainer(ContextContainer.FULLSCREEN)) {
    return dimensions.fullscreen;
  }

  return dimensions.unknown;
}
