import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { filter } from 'rxjs';
import Browser from 'webextension-polyfill';

import { ApprovalRequest, ContextContainer } from '@core/types';

import { isSpecificContextContainer } from '../../utils';
import { useConnectionContext } from '../ConnectionProvider';
import { isApprovalRequest } from './isApprovalRequest';
import { isActionsUpdate } from './isActionsUpdate';

export const ApprovalsContext = createContext<{
  approval?: ApprovalRequest;
}>({
  approval: undefined,
});

export function ApprovalsContextProvider({
  children,
}: PropsWithChildren<object>) {
  const { events, tabId } = useConnectionContext();
  const [approval, setApproval] = useState<ApprovalRequest>();

  useEffect(() => {
    const approvalRequests = events()
      .pipe(filter(isApprovalRequest))
      .subscribe(async (event) => {
        const windowId = (await Browser.windows.getCurrent()).id;
        const comesFromSameExtensionWindow = tabId === event.value.action.tabId;
        const comesFromSameWindow = event.value.action.windowId === windowId;
        const isSidepanelView = isSpecificContextContainer(
          ContextContainer.SIDE_PANEL,
        );

        const isComingFromSameWindowWithSidepanel =
          isSidepanelView && comesFromSameWindow;

        if (
          comesFromSameExtensionWindow ||
          isComingFromSameWindowWithSidepanel
        ) {
          setApproval(event.value);
        }
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
