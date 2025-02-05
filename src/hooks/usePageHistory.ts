import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useEffect, useState } from 'react';
import type * as H from 'history';
import type {
  NavigationHistoryDataState,
  NavigationHistoryState,
} from '@src/background/services/navigationHistory/models';
import type { SetNavigationHistoryDataHandler } from '@src/background/services/navigationHistory/handlers/setNavigationHistoryData';
import type { GetNavigationHistoryHandler } from '@src/background/services/navigationHistory/handlers/getNavigationHistory';
import type { SetNavigationHistoryHandler } from '@src/background/services/navigationHistory/handlers/setNavigationHistory';
import type { GetNavigationHistoryDataHandler } from '@src/background/services/navigationHistory/handlers/getNavigationHistoryData';

export function usePageHistory() {
  const { request } = useConnectionContext();
  const [historyDataState, setHistoryDataState] = useState<{
    isLoading: boolean;
    [key: string]: any;
  }>({ isLoading: true });
  const [historyState, setHistoryState] = useState<NavigationHistoryState>({});

  const setNavigationHistoryData = useCallback(
    (data: NavigationHistoryDataState) => {
      request<SetNavigationHistoryDataHandler>({
        method: ExtensionRequest.NAVIGATION_HISTORY_DATA_SET,
        params: [data],
      });
    },
    [request],
  );

  const getNavigationHistoryData = useCallback(async () => {
    const result = await request<GetNavigationHistoryDataHandler>({
      method: ExtensionRequest.NAVIGATION_HISTORY_DATA_GET,
    });
    setHistoryDataState({ ...result, isLoading: false });
  }, [request]);

  const setNavigationHistory = useCallback(
    (history: H.History<unknown>) => {
      request<SetNavigationHistoryHandler>({
        method: ExtensionRequest.NAVIGATION_HISTORY_SET,
        params: [history],
      });
    },
    [request],
  );

  const getNavigationHistory = useCallback(async () => {
    const result = await request<GetNavigationHistoryHandler>({
      method: ExtensionRequest.NAVIGATION_HISTORY_GET,
    });
    setHistoryState(result);
  }, [request]);

  useEffect(() => {
    const getHistory = async () => {
      await getNavigationHistory();
      await getNavigationHistoryData();
    };
    getHistory();
  }, [getNavigationHistory, getNavigationHistoryData]);

  const getPageHistoryData = useCallback(() => {
    return historyDataState;
  }, [historyDataState]);

  const getNavigationHistoryState = useCallback(() => {
    return historyState;
  }, [historyState]);

  return {
    getNavigationHistoryData,
    setNavigationHistoryData,
    historyDataState,
    getPageHistoryData,
    setNavigationHistory,
    getNavigationHistoryState,
  };
}
