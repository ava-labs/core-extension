import { runtime } from 'webextension-polyfill';

import { SYNCED_DOMAINS } from 'packages/common/src/constants';

export const isSyncDomain = (
  domain: string,
  exposedDomainList: string[] = [],
) => {
  return [runtime.id, ...SYNCED_DOMAINS, ...exposedDomainList].some(
    (syncDomain) => {
      // Match exact domains, but also allow subdomains (i.e. develop.core-web.pages.dev)
      return syncDomain === domain || domain.endsWith(`.${syncDomain}`);
    },
  );
};

/**
 * Returns the extension's ID for synced domains (i.e. the Core Suite apps)
 */
export const getSyncDomain = (domain: string) => {
  return isSyncDomain(domain) ? runtime.id : domain;
};
