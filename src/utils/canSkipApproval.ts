import { isSyncDomain } from '@src/background/services/network/utils/getSyncDomain';

import { isActiveTab } from './isActiveTab';
import { runtime } from 'webextension-polyfill';

type SkipApprovalOptions = {
  allowInactiveTabs?: boolean;
  domainWhitelist?: string[];
};

export const canSkipApproval = async (
  domain: string,
  tabId: number,
  { allowInactiveTabs, domainWhitelist }: SkipApprovalOptions = {}
) => {
  if (!isSyncDomain(domain, domainWhitelist)) {
    return false;
  }

  return (
    allowInactiveTabs ||
    domain === runtime.id || // chrome.tabs.get(...) does not see extension popup
    (await isActiveTab(tabId))
  );
};
