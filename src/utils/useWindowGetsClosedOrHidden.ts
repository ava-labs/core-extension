import { useEffect } from 'react';
import { filter, first, fromEventPattern, merge } from 'rxjs';

export function useWindowGetsClosedOrHidden(cancelHandler: () => void) {
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
        cancelHandler();
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [cancelHandler]);
}
