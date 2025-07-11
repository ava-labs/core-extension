import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';

export function useCurrentDomain() {
  const [domain, setDomain] = useState<string>();

  useEffect(() => {
    const updateDomain = async () => {
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
    };

    updateDomain();

    browser.tabs.onActivated.addListener(updateDomain);

    return () => {
      browser.tabs.onActivated.removeListener(updateDomain);
    };
  }, []);

  return domain;
}
