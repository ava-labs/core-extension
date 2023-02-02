import {
  ContextContainer,
  useIsSpecificContextContainer,
} from './useIsSpecificContextContainer';

export function useAppDimensions(): { width: string; height: string } {
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

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
  }

  return {
    height: '',
    width: '',
  };
}
