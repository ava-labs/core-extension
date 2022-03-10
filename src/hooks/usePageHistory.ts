import { ExtensionRequest } from '@src/background/connections/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useEffect, useState } from 'react';
import * as H from 'history';
import { NavigationHistoryState } from '@src/background/services/navigationHistory/navigationHistory';

export function usePageHistory() {
  const { request } = useConnectionContext();
  const [historyDataState, setHistoryDataState] = useState({});
  const [historyState, setHistoryState] = useState<NavigationHistoryState>({});

  const setNavigationHistoryData = (data: Record<string, unknown>) => {
    console.log('data: ', data);
    request({
      method: ExtensionRequest.NAVIGATION_HISTORY_DATA_SET,
      params: [data],
    });
  };

  const getNavigationHistoryData = useCallback(() => {
    request({
      method: ExtensionRequest.NAVIGATION_HISTORY_DATA_GET,
    }).then((result) => {
      setHistoryDataState(result);
    });
  }, [request]);

  const setNavigationHistory = (history: H.History<unknown>) => {
    request({
      method: ExtensionRequest.NAVIGATION_HISTORY_SET,
      params: [history],
    });
  };

  const getNavigationHistory = useCallback(() => {
    request({
      method: ExtensionRequest.NAVIGATION_HISTORY_GET,
    }).then((result) => {
      setHistoryState(result);
    });
  }, [request]);

  useEffect(() => {
    getNavigationHistory();
    getNavigationHistoryData();
  }, [getNavigationHistory, getNavigationHistoryData]);

  const getPageHistoryData = () => {
    return historyDataState ?? null;
  };

  const getNavigationHistoryState = () => {
    return historyState;
  };

  return {
    getNavigationHistoryData,
    setNavigationHistoryData,
    historyDataState,
    getPageHistoryData,
    setNavigationHistory,
    getNavigationHistoryState,
  };
}
