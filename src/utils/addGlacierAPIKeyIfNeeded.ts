export function addGlacierAPIKeyIfNeeded(url: string): string {
  const urlObject = new URL(url);
  if (
    process.env.GLACIER_API_KEY &&
    (urlObject.host === 'glacier-api.avax-test.network' ||
      urlObject.host === 'glacier-api.avax.network')
  ) {
    urlObject.searchParams.append('token', process.env.GLACIER_API_KEY);
    return urlObject.toString();
  }

  return url;
}
