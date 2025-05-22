import type { ContextContainer } from '@core/types';
import { useMemo } from 'react';

export function useIsSpecificContextContainer(context: ContextContainer) {
  return useMemo(() => {
    return window.location.pathname.includes(context);
  }, [context]);
}
