export const toSafeCssUrl = (rawUrl: string | undefined): string => {
  if (!rawUrl) {
    return 'none';
  }

  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return 'none';
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return 'none';
  }

  return `url("${CSS.escape(parsed.href)}")`;
};
