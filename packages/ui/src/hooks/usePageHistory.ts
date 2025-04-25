import { ExtensionRequest } from '@core/service-worker';
import { useConnectionContext } from '@/contexts/ConnectionProvider';
import { useCallback, useEffect, useState } from 'react';
import * as H from 'history';
import {
  NavigationHistoryDataState,
  NavigationHistoryState,
} from '@core/service-worker';
import { SetNavigationHistoryDataHandler } from '@core/service-worker';
import { GetNavigationHistoryHandler } from '@core/service-worker';
import { SetNavigationHistoryHandler } from '@core/service-worker';
import { GetNavigationHistoryDataHandler } from '@core/service-worker';

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
