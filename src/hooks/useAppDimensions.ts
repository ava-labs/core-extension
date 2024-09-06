import {
  ContextContainer,
  useIsSpecificContextContainer,
} from './useIsSpecificContextContainer';

export function useAppDimensions(): {
  height: string;
  width: string;
  minWidth?: string;
  maxHeight?: string;
} {
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const isSidePanel = useIsSpecificContextContainer(ContextContainer.SIDEPANEL);
  const isFullscreen = useIsSpecificContextContainer(
    ContextContainer.FULLSCREEN
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
  } else if (isSidePanel) {
    return {
      width: '100%',
      height: '100%',
      minWidth: '360px',
    };
  }

  return {
    height: '',
    width: '',
  };
}
