import { useCallback, useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';

export function useCurrentDomain() {
  const [domain, setDomain] = useState<string>();

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

  return domain;
}
