import { loadEnv } from '@rsbuild/core';
import path from 'path';

// Read at runtime from chrome.storage (CORE_API_KEYS_STORAGE_KEY in
// @core/common). Inlining them would publish them with every build artifact.
const RUNTIME_ONLY_ENV_VARS = new Set([
  'CORE_PROXY_API_KEY',
  'GLACIER_API_KEY',
  'MARKR_API_TOKEN',
  'ID_SERVICE_API_KEY',
]);

export const getEnvVars = (mode: 'dev' | 'production') => {
  const { parsed } = loadEnv({
    cwd: path.resolve(__dirname, '..'),
    mode,
  });

  return Object.entries(parsed)
    .filter(([envVariable]) => !RUNTIME_ONLY_ENV_VARS.has(envVariable))
    .reduce<Record<string, string>>(
      (accumulator, [envVariable, value]) => ({
        ...accumulator,
        [`process.env.${envVariable}`]: JSON.stringify(value),
      }),
      {},
    );
};
