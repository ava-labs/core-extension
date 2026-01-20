import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig([
  // multiple config can go here
  {
    input: 'https://core-balance-api.avax.network/schema.json',
    output: 'packages/service-worker/src/api-clients/balance-api',
  },
  {
    input: 'https://core-profile-api.avax.network/schema.json',
    output: 'packages/service-worker/src/api-clients/profile-api',
  },
  {
    input: 'https://core-token-aggregator.avax-test.network/schema.json',
    output: 'packages/service-worker/src/api-clients/token-aggregator',
  },
]);
