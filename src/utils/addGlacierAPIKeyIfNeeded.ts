export function addGlacierAPIKeyIfNeeded(url: string): string {
  if (
    process.env.GLACIER_API_KEY &&
    (url.startsWith('https://glacier-api.avax-test.network') ||
      url.startsWith('https://glacier-api.avax.network'))
  ) {
    return `${url}?token=${process.env.GLACIER_API_KEY}`;
  }

  return url;
}
