import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { useEffect } from 'react';
import { filter, first, fromEventPattern, merge } from 'rxjs';

export function useWindowGetsClosedOrHidden(cancelHandler: () => void) {
  const isConfirmPopup = useIsSpecificContextContainer(
    ContextContainer.CONFIRM
  );

  useEffect(() => {
    const subscription = merge(
      fromEventPattern(
        (handler) => {
          window.addEventListener('unload', handler);
        },
        (handler) => {
          window.removeEventListener('unload', handler);
        }
      ),
      fromEventPattern(
        (handler) => {
          window.addEventListener('visibilitychange', handler);
        },
        (handler) => {
          window.removeEventListener('visibilitychange', handler);
        }
      ).pipe(
        filter(() => {
          return document.visibilityState === 'hidden';
        })
      )
    )
      .pipe(first())
      .subscribe(() => {
        // Only close for popup windows. The extension UI should not react this way.
        if (isConfirmPopup) {
          cancelHandler();
        }
      });

    return () => {
      subscription?.unsubscribe();
    };
  }, [cancelHandler, isConfirmPopup]);
}
