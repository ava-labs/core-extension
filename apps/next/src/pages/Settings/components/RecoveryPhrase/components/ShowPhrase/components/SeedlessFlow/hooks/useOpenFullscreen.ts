import { openFullscreenTab } from '@core/common';
import { ContextContainer } from '@core/types';
import { isSpecificContextContainer } from '@core/ui';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useOpenFullscreen() {
  const { pathname } = useLocation();
  const isFullscreen = isSpecificContextContainer(ContextContainer.FULLSCREEN);

  useEffect(() => {
    if (!isFullscreen) {
      openFullscreenTab(pathname.slice(1));
      window.close();
    }
  }, [isFullscreen, pathname]);
}
