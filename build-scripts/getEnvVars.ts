import { loadEnv } from '@rsbuild/core';
import path from 'path';

// Only these are inlined into bundles, and every bundle ships publicly, so a
// variable belongs here only if its value is safe to publish. Secrets are read
// at runtime instead (CORE_API_KEYS_STORAGE_KEY in @core/common).
const BUNDLED_ENV_VARS = new Set([
  'APPLE_OAUTH_CLIENT_ID',
  'APPLE_OAUTH_REDIRECT_URL',
  'BALANCE_SERVICE_URL',
  'CORE_PROXY_GLACIER_BASE_URL',
  'CORE_WEB_BASE_URL',
  'CUBESIGNER_ENV',
  'FIREBASE_CONFIG',
  'GASLESS_SERVICE_URL',
  'GLACIER_URL',
  'ID_SERVICE_URL',
  'MARKR_API_URL',
  'NEWSLETTER_BASE_URL',
  'NEWSLETTER_FORM_ID',
  'NEWSLETTER_PORTAL_ID',
  'NOTIFICATION_SENDER_SERVICE_URL',
  'POSTHOG_KEY',
  'POSTHOG_URL',
  'PROFILE_SERVICE_URL',
  'PROXY_URL',
  'RELEASE',
  'SEEDLESS_FIDO_IDENTITY_URL',
  'SEEDLESS_ORG_ID',
  'SEEDLESS_URL',
  'SENTRY_DEBUG',
  'SENTRY_DSN',
  'TOKEN_AGGREGATOR_SERVICE_URL',
  'WALLET_CONNECT_PROJECT_ID',
]);

export const getEnvVars = (mode: 'dev' | 'production') => {
  const { parsed } = loadEnv({
    cwd: path.resolve(__dirname, '..'),
    mode,
  });

  return Object.entries(parsed)
    .filter(([envVariable]) => BUNDLED_ENV_VARS.has(envVariable))
    .reduce<Record<string, string>>(
      (accumulator, [envVariable, value]) => ({
        ...accumulator,
        [`process.env.${envVariable}`]: JSON.stringify(value),
      }),
      {},
    );
};
