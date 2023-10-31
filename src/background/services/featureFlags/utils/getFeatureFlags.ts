import { FeatureGates, DISABLED_FLAG_VALUES } from '../models';

export async function getFeatureFlags(
  token?: string,
  userId?: string,
  posthogUrl?: string,
  ver = '1.20.0',
  v = '3'
) {
  if (!token) {
    throw new Error('Invalid token');
  }

  if (!posthogUrl) {
    throw new Error('Invalid Posthog URL');
  }

  const json_data = JSON.stringify({
    token,
    distinct_id: userId,
    groups: {},
  });

  const data = Buffer.from(json_data).toString('base64');

  const params = new URLSearchParams({
    ip: '0',
    _: Date.now().toString(),
    v,
    ver,
  });

  const response: {
    featureFlags: { [key in FeatureGates]: boolean };
    featureFlagPayloads: Partial<Record<FeatureGates, string>>;
  } = await (
    await fetch(`${posthogUrl}/decide/?${params}`, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(data),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  ).json();

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
