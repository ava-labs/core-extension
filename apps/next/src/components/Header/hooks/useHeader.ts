import { RefObject, useEffect, useMemo, useState } from 'react';
import { useAccountInfoVisibility } from '@/contexts/AccountInfoVisibilityContext';

const HEADER_PADDING = 24; // Buffer for spacing

export const useHeader = (
  headerActionsRef: RefObject<HTMLDivElement | null>,
) => {
  const { isAccountInfoVisible } = useAccountInfoVisibility();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [headerActionsWidth, setHeaderActionsWidth] = useState(0);

  // Calculate available width for header info (subtract header actions width and buffer)
  const headerInfoWidth = useMemo(
    () => Math.max(0, windowWidth - headerActionsWidth - HEADER_PADDING),
    [windowWidth, headerActionsWidth],
  );

  // Use ResizeObserver for accurate header actions width measurement
  useEffect(() => {
    const element = headerActionsRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use borderBoxSize for more accurate measurement including padding
        const width =
          entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        setHeaderActionsWidth(Math.ceil(width));
      }
    });

    observer.observe(element);
    // Initial measurement
    setHeaderActionsWidth(Math.ceil(element.getBoundingClientRect().width));

    return () => observer.disconnect();
  }, [headerActionsRef]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowWidth,
    headerActionsWidth,
    headerInfoWidth,
    isAccountInfoVisible,
  };
};
