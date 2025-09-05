import { runtime } from 'webextension-polyfill';
import { SYNCED_DOMAINS } from '../constants';

export const isSyncDomain = (
  domain: string,
  exposedDomainList: (string | RegExp)[] = [],
) => {
  return [runtime.id, ...SYNCED_DOMAINS, ...exposedDomainList].some(
    (syncDomain) => {
      if (syncDomain instanceof RegExp) {
        return syncDomain.test(domain);
      }

      // Match exact domains, but also allow subdomains
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
