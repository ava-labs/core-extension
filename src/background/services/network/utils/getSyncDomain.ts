import { runtime } from 'webextension-polyfill';

import { SYNCED_DOMAINS } from '../models';

/**
 * Returns the extension's ID for synced domains (i.e. the Core Suite apps)
 */
export const getSyncDomain = (domain: string) => {
  return SYNCED_DOMAINS.includes(domain) ? runtime.id : domain;
};
