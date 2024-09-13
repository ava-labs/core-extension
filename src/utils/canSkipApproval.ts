import { isSyncDomain } from '@src/background/services/network/utils/getSyncDomain';

import { isActiveTab } from './isActiveTab';
import { runtime } from 'webextension-polyfill';

export const canSkipApproval = async (domain: string, tabId: number) => {
  return (
    isSyncDomain(domain) &&
    // chrome.tabs.get(...) does not see extension popup
    (domain === runtime.id || (await isActiveTab(tabId)))
  );
};
