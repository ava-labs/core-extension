import { runtime } from 'webextension-polyfill';

const SYNCED_DOMAINS = [
  'core-web.pages.dev',
  'core.app',
  'test.core.app',
  runtime.id,
  'develop.avacloud-app.pages.dev',
  'avacloud.io',
];

export const isSyncDomain = (domain: string) => {
  return SYNCED_DOMAINS.some((syncDomain) => {
    // Match exact domains, but also allow subdomains (i.e. develop.core-web.pages.dev)
    return syncDomain === domain || domain.endsWith(`.${syncDomain}`);
  });
};

/**
 * Returns the extension's ID for synced domains (i.e. the Core Suite apps)
 */
export const getSyncDomain = (domain: string) => {
  return isSyncDomain(domain) ? runtime.id : domain;
};
