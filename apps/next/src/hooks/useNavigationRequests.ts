import { isNavigationHistoryRequestEvent } from '@core/common';
import { ContextContainer } from '@core/types';
import { isSpecificContextContainer, useConnectionContext } from '@core/ui';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { filter } from 'rxjs';

export const useNavigationRequests = () => {
  const { events } = useConnectionContext();
  const history = useHistory();

  useEffect(() => {
    /* The list of contexts that should support navigation history */
    const supportedContexts = [
      ContextContainer.POPUP,
      ContextContainer.SIDE_PANEL,
    ];
    if (!supportedContexts.some(isSpecificContextContainer)) {
      return;
    }
    const eventsSubscription = events()
      .pipe(filter(isNavigationHistoryRequestEvent))
      .subscribe(async (event) => {
        if (history.location.pathname !== event.value.path) {
          history.push(event.value.path);
        }
      });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, [events, history]);
};
