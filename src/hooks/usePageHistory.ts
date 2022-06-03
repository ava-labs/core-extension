import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useEffect, useState } from 'react';
import * as H from 'history';
import { NavigationHistoryState } from '@src/background/services/navigationHistory/models';

export function usePageHistory() {
  const { request } = useConnectionContext();
  const [historyDataState, setHistoryDataState] = useState({});
  const [historyState, setHistoryState] = useState<NavigationHistoryState>({});

  const setNavigationHistoryData = useCallback(
    (data: Record<string, unknown>) => {
      request({
        method: ExtensionRequest.NAVIGATION_HISTORY_DATA_SET,
        params: [data],
      });
    },
    [request]
  );

  const getNavigationHistoryData = useCallback(() => {
    request({
      method: ExtensionRequest.NAVIGATION_HISTORY_DATA_GET,
    }).then((result) => {
      setHistoryDataState(result);
    });
  }, [request]);

  const setNavigationHistory = useCallback(
    (history: H.History<unknown>) => {
      request({
        method: ExtensionRequest.NAVIGATION_HISTORY_SET,
        params: [history],
      });
    },
    [request]
  );

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
