import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { type LocationDescriptor } from 'history';

export type ViewTransitionType = 'scale' | 'slide';
type UseHistory = ReturnType<typeof useHistory>;

type OtherHistoryFunctions = Omit<
  UseHistory,
  'go' | 'push' | 'goBack' | 'goForward'
>;
type NavigationFunctionsWithDefaultTransition = {
  go: (
    step: number,
    viewTransition?: ViewTransitionType,
  ) => ViewTransition | void;
  push: (
    path: string | LocationDescriptor,
    options?: { state?: unknown; viewTransition?: ViewTransitionType },
  ) => ViewTransition | void;
  goBack: (viewTransition?: ViewTransitionType) => ViewTransition | void;
  goForward: (viewTransition?: ViewTransitionType) => ViewTransition | void;
};

type NavigationFunctionsWithoutDefaultTransition = {
  go: (
    step: number,
    viewTransition: ViewTransitionType,
  ) => ViewTransition | void;
  push: (
    path: string,
    options: { state?: unknown; viewTransition: ViewTransitionType },
  ) => ViewTransition | void;
  goBack: (viewTransition?: ViewTransitionType) => ViewTransition | void;
  goForward: (viewTransition: ViewTransitionType) => ViewTransition | void;
};

type UseNavigationReturn<
  DefaultTransitionType extends ViewTransitionType | undefined = undefined,
> = OtherHistoryFunctions &
  (DefaultTransitionType extends ViewTransitionType
    ? NavigationFunctionsWithDefaultTransition
    : NavigationFunctionsWithoutDefaultTransition);

/**
 * Wrapper around useHistory() which also triggers view transition,
 * unless user prefers to skip motion.
 */

let latestTransition: ViewTransitionType | undefined = undefined;
export const useNavigation = <
  T extends ViewTransitionType | undefined = undefined,
>(
  defaultTransitionType?: T,
): UseNavigationReturn<T> => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const skipTransition = motionQuery.matches;

  const {
    go: historyGo,
    goBack: historyGoBack,
    goForward: historyGoForward,
    push: historyPush,
    replace: historyReplace,
    ...history
  } = useHistory();

  const go: UseNavigationReturn['go'] = useCallback(
    (step, viewTransition) => {
      if (skipTransition) {
        return historyGo(step);
      }

      const movingForward = step > 0;
      return navigateWithTransition(
        () => historyGo(step),
        getTransitionName(
          movingForward,
          viewTransition ?? defaultTransitionType,
        ),
      );
    },
    [historyGo, skipTransition, defaultTransitionType],
  );

  const push: UseNavigationReturn<T>['push'] = useCallback(
    (path, options) => {
      const state = options?.state;
      const viewTransition = options?.viewTransition ?? defaultTransitionType;
      latestTransition = viewTransition;
      if (skipTransition) {
        return historyPush(path, state);
      }

      return navigateWithTransition(
        () => historyPush(path, state),
        getTransitionName(true, viewTransition),
      );
    },
    [historyPush, skipTransition, defaultTransitionType],
  );

  const goBack: UseNavigationReturn<T>['goBack'] = useCallback(
    (viewTransition) => {
      const canGoBack = history.length > 2;
      // Use replace if there is no previous state to go back to.
      // Happens when user reopens the extension after closing it on a specific page.
      const update = () => (canGoBack ? historyGoBack() : historyReplace('/'));

      if (skipTransition) {
        return update();
      }

      return navigateWithTransition(
        update,
        getTransitionName(
          false,
          viewTransition ?? defaultTransitionType ?? latestTransition,
        ),
      );
    },
    [
      historyGoBack,
      skipTransition,
      history.length,
      historyReplace,
      defaultTransitionType,
    ],
  );

  const goForward: UseNavigationReturn<T>['goForward'] = useCallback(
    (viewTransition?: ViewTransitionType) => {
      if (skipTransition) {
        return historyGoForward();
      }

      return navigateWithTransition(
        () => historyGoForward(),
        getTransitionName(true, viewTransition ?? defaultTransitionType),
      );
    },
    [historyGoForward, skipTransition, defaultTransitionType],
  );

  return {
    ...history,
    go,
    goBack,
    goForward,
    push,
    replace: historyReplace,
  } as UseNavigationReturn<T>;
};

const navigateWithTransition = (update: () => void, type?: string) => {
  return document.startViewTransition({
    update,
    types: type ? [type] : undefined,
  });
};

const getTransitionName = (
  isForward: boolean,
  viewTransition: ViewTransitionType | undefined,
) => {
  const suffix = isForward ? 'forward' : 'back';

  switch (viewTransition) {
    case 'scale':
      return `scale-${suffix}`;
    case 'slide':
      return `slide-${suffix}`;
    default:
      console.warn(`Unknown view transition type: ${viewTransition}`);
      return;
  }
};
