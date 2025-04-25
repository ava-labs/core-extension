import { createContext, useContext, useEffect, useState } from 'react';
import { filter } from 'rxjs';

import {
  ApprovalRequest,
} from '@core/types';
import {
  isActionsUpdate,
  isApprovalRequest,
} from '@core/service-worker';

import { useConnectionContext } from './ConnectionProvider';

export const ApprovalsContext = createContext<{
  approval?: ApprovalRequest;
}>({
  approval: undefined,
});

export function ApprovalsContextProvider({ children }: { children: any }) {
  const { events, tabId } = useConnectionContext();
  const [approval, setApproval] = useState<ApprovalRequest>();

  useEffect(() => {
    const approvalRequests = events()
      .pipe(filter(isApprovalRequest))
      .subscribe(async (event) => {
        if (tabId !== event.value.action.tabId) {
          return;
        }

        setApproval(event.value);
      });

    return () => {
      approvalRequests.unsubscribe();
    };
  }, [events, tabId]);

  useEffect(() => {
    const actionsUpdates = events()
      .pipe(filter(isActionsUpdate))
      .subscribe(async (event) => {
        setApproval((prev) => {
          if (!prev) {
            return undefined;
          }

          const updatedAction = event.value[prev.action.actionId!];

          // If the action was completed (removed), clean up the state.
          if (!updatedAction) {
            return undefined;
          }

          // Otherwise it may have been updated -> update state.
          return {
            ...prev,
            action: updatedAction,
          };
        });
      });

    return () => {
      actionsUpdates.unsubscribe();
    };
  }, [events]);

  return (
    <ApprovalsContext.Provider
      value={{
        approval,
      }}
    >
      {children}
    </ApprovalsContext.Provider>
  );
}

export function useApprovalsContext() {
  return useContext(ApprovalsContext);
}
