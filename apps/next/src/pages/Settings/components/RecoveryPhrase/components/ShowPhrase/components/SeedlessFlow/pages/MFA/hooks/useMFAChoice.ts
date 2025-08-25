import { isSeedlessMfaChoiceRequest } from '@core/common';
import { MfaChoiceRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useEffect, useState } from 'react';
import { filter } from 'rxjs';

export function useMFAChoice() {
  const { events, tabId } = useConnectionContext();
  const [choice, setChoice] = useState<MfaChoiceRequest>();

  useEffect(() => {
    const eventsSubscription = events()
      .pipe(filter(isSeedlessMfaChoiceRequest))
      .subscribe(async (event) => {
        if (event.value.tabId !== tabId) {
          return;
        }

        setChoice(event.value);
      });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, [events, tabId]);

  return {
    choice,
  };
}
