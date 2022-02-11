import {
  ContextContainer,
  useIsSpecificContextContainer,
} from './useIsSpecificContextContainer';

export function useAppDimensions(): { width: string; height: string } {
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  if (isMiniMode || isConfirm) {
    return {
      height: '600px',
      width: '375px',
    };
  }

  return {
    height: '',
    width: '',
  };
}
