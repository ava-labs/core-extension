import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useEffect, useState } from 'react';
import * as H from 'history';
import {
  NavigationHistoryDataState,
  NavigationHistoryState,
} from '@src/background/services/navigationHistory/models';
import { SetNavigationHistoryDataHandler } from '@src/background/services/navigationHistory/handlers/setNavigationHistoryData';
import { GetNavigationHistoryHandler } from '@src/background/services/navigationHistory/handlers/getNavigationHistory';
import { SetNavigationHistoryHandler } from '@src/background/services/navigationHistory/handlers/setNavigationHistory';
import { GetNavigationHistoryDataHandler } from '@src/background/services/navigationHistory/handlers/getNavigationHistoryData';

export function usePageHistory() {
  const { request } = useConnectionContext();
  const [isLoading, setIsLoading] = useState(true);
  const [historyDataState, setHistoryDataState] = useState<Record<string, any>>(
    { isLoading: true }
  );
  const [historyState, setHistoryState] = useState<NavigationHistoryState>({});

  const setNavigationHistoryData = useCallback(
    (data: NavigationHistoryDataState) => {
      request<SetNavigationHistoryDataHandler>({
        method: ExtensionRequest.NAVIGATION_HISTORY_DATA_SET,
        params: [data],
      });
    },
    [request]
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
    [request]
  );

  const getNavigationHistory = useCallback(async () => {
    const result = await request<GetNavigationHistoryHandler>({
      method: ExtensionRequest.NAVIGATION_HISTORY_GET,
    });
    setHistoryState(result);
  }, [request]);

  useEffect(() => {
    const getHistory = async () => {
      setIsLoading(true);
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
    isHistoryLoading: isLoading,
  };
}
