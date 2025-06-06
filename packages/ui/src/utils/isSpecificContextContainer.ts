import type { ContextContainer } from '@core/types';

export function isSpecificContextContainer(context: ContextContainer) {
  return window.location.pathname.includes(context);
}

/**
 * @deprecated use `isSpecificContextContainer` instead
 * @description This hook is deprecated and will be removed in the future. It has been left to avoid changes to the legacy codebase.
 */
export function useIsSpecificContextContainer(context: ContextContainer) {
  return isSpecificContextContainer(context);
}
