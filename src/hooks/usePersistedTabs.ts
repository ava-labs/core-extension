import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const usePersistedTabs = (
  defaultTab: number,
  tabParam = 'activeTab',
) => {
  const { search, pathname } = useLocation();
  const history = useHistory();

  const tabFromUrl = useMemo(() => {
    const params = new URLSearchParams(search);
    const tab = params.get(tabParam);

    if (tab !== null) {
      return Number(tab);
    }

    return null;
  }, [search, tabParam]);

  const setActiveTab = useCallback(
    (tab: number) => {
      // Avoid unnecessary re-renders
      if (tab === tabFromUrl) {
        return;
      }

      history.replace({
        pathname: pathname,
        search: `?${new URLSearchParams({
          [tabParam]: String(tab),
        }).toString()}`,
      });
    },
    [history, tabFromUrl, tabParam, pathname],
  );

  return {
    activeTab: tabFromUrl ?? defaultTab,
    setActiveTab,
  };
};
