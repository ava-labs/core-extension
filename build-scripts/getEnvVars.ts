import { loadEnv } from '@rsbuild/core';
import path from 'path';

export const getEnvVars = (mode: 'dev' | 'production') => {
  const { parsed } = loadEnv({
    cwd: path.resolve(__dirname, '..'),
    mode,
  });

  return Object.entries(parsed).reduce<Record<string, string>>(
    (accumulator, [envVariable, value]) => ({
      ...accumulator,
      [`process.env.${envVariable}`]: JSON.stringify(value),
    }),
    {},
  );
};
