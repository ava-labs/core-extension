import { FeatureFlags, FeatureFlagPayloads } from '@core/types';
import { DISABLED_FLAG_VALUES } from '@core/common';
export async function getFeatureFlags(
  token?: string,
  userId?: string,
  posthogUrl?: string,
  ver = '1.20.0',
  v = '3',
) {
  if (!token) {
    throw new Error('Invalid token');
  }

  const json_data = JSON.stringify({
    token,
    distinct_id: userId || 'core-extension',
    groups: {},
  });

  const data = Buffer.from(json_data).toString('base64');

  const params = new URLSearchParams({
    ip: '0',
    _: Date.now().toString(),
    v,
    ver,
  });

  const fetchWithPosthogFallback = async () => {
    const fetcher = async (url: string) => {
      const response: {
        featureFlags: FeatureFlags;
        featureFlagPayloads: Partial<FeatureFlagPayloads>;
      } = await (
        await fetch(`${url}/decide?${params}`, {
          method: 'POST',
          body: 'data=' + encodeURIComponent(data),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      ).json();

      return response;
    };

    try {
      const response = await fetcher(`${process.env.PROXY_URL}/proxy/posthog`);

      if (!response.featureFlags) {
        throw new Error('Failed to fetch cached data.');
      }

      return response;
    } catch {
      if (!posthogUrl) {
        throw new Error('Invalid Posthog URL');
      }

      const response = await fetcher(posthogUrl);
      return response;
    }
  };

  const response = await fetchWithPosthogFallback();

  // Posthog API does not return disabled flags on their `/decide` api endpoint
  // Define disabled state values for the flags
  return {
    flags: {
      ...DISABLED_FLAG_VALUES,
      ...response.featureFlags,
    },
    flagPayloads: response.featureFlagPayloads ?? {},
  };
}
