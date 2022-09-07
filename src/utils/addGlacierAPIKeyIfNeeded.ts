export function addGlacierAPIKeyIfNeeded(url: string): string {
  const urlObject = new URL(url);
  if (
    process.env.GLACIER_API_KEY &&
    (urlObject.host === 'glacier-api.avax-test.network' ||
      urlObject.host === 'https://glacier-api.avax.network')
  ) {
    return `${url}?token=${process.env.GLACIER_API_KEY}`;
  }

  return url;
}
