// Restrict to http(s) so values from this helper can be safely passed to
// `browser.tabs.create`, fetched, or rendered as links without enabling
// `javascript:`/`data:`/etc. navigation vectors.
const ALLOWED_URL_PROTOCOLS = new Set(['http:', 'https:']);

export const isUrlValid = (url: string) => {
  try {
    const parsed = new URL(url);

    if (!ALLOWED_URL_PROTOCOLS.has(parsed.protocol)) {
      return false;
    }

    if (parsed.username || parsed.password) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
