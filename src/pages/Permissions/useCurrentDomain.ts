import { useCallback, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';

export function useCurrentDomain() {
  const [domain, setDomain] = useState<string>();
  const [tabId, setTabId] = useState<number>();

  const updateDomain = useCallback(async () => {
    const [currentTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (currentTab?.url) {
      const { hostname } = new URL(currentTab.url);
      setDomain(hostname);
    } else {
      setDomain('');
    }

    if (currentTab?.id) {
      setTabId(currentTab.id);
    } else {
      setTabId(undefined);
    }
  }, [setDomain]);

  useEffect(() => {
    updateDomain();

    const listener = async () => {
      await updateDomain();
    };
    browser.tabs.onActivated.addListener(listener);

    return () => {
      browser.tabs.onActivated.removeListener(listener);
    };
  }, [updateDomain]);

  return { domain, tabId };
}
