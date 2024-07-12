import { runtime } from 'webextension-polyfill';

import { SYNCED_DOMAINS } from '../models';

/**
 * Returns the extension's ID for synced domains (i.e. the Core Suite apps)
 */
export const getSyncDomain = (domain: string) => {
  const matchesSyncDomain = SYNCED_DOMAINS.some((syncDomain) => {
    // Match exact domains, but also allow subdomains (i.e. develop.core-web.pages.dev)
    return syncDomain === domain || domain.endsWith(`.${syncDomain}`);
  });

  return matchesSyncDomain ? runtime.id : domain;
};
