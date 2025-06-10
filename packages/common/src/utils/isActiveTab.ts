import { tabs } from 'webextension-polyfill';

export const isActiveTab = async (tabId: number) => {
  try {
    const tab = await tabs.get(tabId);
    return Boolean(tab) && tab.active;
  } catch {
    return false;
  }
};
