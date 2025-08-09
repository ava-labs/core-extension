import { memoize } from 'lodash';

export const getFaviconUrl = (domain: string): string => {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

export const isFaviconExists = memoize(async (domain: string) => {
  const { ok } = await fetch(getFaviconUrl(domain));
  return ok;
});
