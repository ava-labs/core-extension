import { RefObject, useCallback, useEffect, useState } from 'react';
import { useAccountInfoVisibility } from '@/contexts/AccountInfoVisibilityContext';

const HEADER_PADDING = 24; // Horizontal padding in the header

export const useHeader = (
  headerActionsRef: RefObject<HTMLDivElement | null>,
) => {
  const { isAccountInfoVisible } = useAccountInfoVisibility();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [headerActionsWidth, setHeaderActionsWidth] = useState(0);

  // Calculate available width for header info
  const headerInfoWidth = Math.max(
    0,
    windowWidth - headerActionsWidth - HEADER_PADDING,
  );

  const updateDimensions = useCallback(() => {
    setWindowWidth(window.innerWidth);
    if (headerActionsRef.current) {
      setHeaderActionsWidth(headerActionsRef.current.offsetWidth);
    }
  }, [headerActionsRef]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  return {
    windowWidth,
    headerActionsWidth,
    headerInfoWidth,
    isAccountInfoVisible,
  };
};
