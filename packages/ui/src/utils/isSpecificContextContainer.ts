import type { ContextContainer } from '@core/types';

export function isSpecificContextContainer(context: ContextContainer) {
  return window.location.pathname.includes(context);
}
