export function addGlacierAPIKeyIfNeeded(url: string): string {
  if (!process.env.GLACIER_URL) {
    return url;
  }

  const urlObject = new URL(url);
  const supportedGlacierUrl = new URL(process.env.GLACIER_URL);

  if (
    process.env.GLACIER_API_KEY &&
    (urlObject.host === supportedGlacierUrl.host ||
      urlObject.host === 'glacier-api.avax.network') // RPC urls returned in the token list are always using the production URL
  ) {
    urlObject.searchParams.append('token', process.env.GLACIER_API_KEY);
    return urlObject.toString();
  }

  return url;
}
