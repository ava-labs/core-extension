# How to generate the api clients

First before diving in on the flow of "version control" in terms of the api client a quick start on how to generate them

Essentially you just need to run the `generate-clients` script from the root `package.json`

This will use the configuration from `openapi-ts.config.ts`. This tells **[@hey-api](https://heyapi.dev/openapi-ts/clients)** from where it should get the `schema.json` and where to put the generated clients

If you need a client to a new service, just add a new config object with the `input-output` pair to the array

# Version control with feature flags

If there is a new feature, or you are updating an existing API you might need to update the current client

If the given service's updated API response is backwards compatible you can just run the aforementioned `generate-clients` and you are good to go

## In case of breaking change

In order to be able to release the extension with the changes without the need to wait for the API deployed first we need to have the old and the new version fo the client live next to eachother.

In such cases you should modify the already existing `openapi-ts.config.ts` config of the client to generate the old client to a `deprecated` folder:
e.g.:

```javascript
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig([
  // multiple config can go here
  {
    input: 'https://core-balance-api.avax.network/schema.json',
    output: 'packages/service-worker/src/api-clients/deprecated/balance-api', // <-- additional deprecated slug
  },
  {
    input: 'https://core-profile-api.avax.network/schema.json',
    output: 'packages/service-worker/src/api-clients/profile-api',
  },
]);
```

After running `generate-clients` you should then update the reference in `packages/service-worker/src/api-clients/clients.ts` to point to the correct folder for the old version

```javascript
import { createClient as createV1BalanceApiClient } from '~/api-clients/deprecated/balance-api/client';
```

After this you should create the new version of the client by adding the config to the `openapi-ts.config.ts` and running `generate-clients`

```javascript
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig([
  // multiple config can go here
  {
    input: 'https://core-balance-api.avax-test.network/schema.json', // <-- pointing to staging
    output: 'packages/service-worker/src/api-clients/balance-api',
  },
  {
    input: 'https://core-balance-api.avax.network/schema.json',
    output: 'packages/service-worker/src/api-clients/deprecated/balance-api',
  },
  {
    input: 'https://core-profile-api.avax.network/schema.json',
    output: 'packages/service-worker/src/api-clients/profile-api',
  },
]);
```

The last step is to add this client to the `packages/service-worker/src/api-clients/clients.ts` file

```javascript
import { container } from 'tsyringe';
import { AppCheckService } from '~/services/appcheck/AppCheckService';
import { createClient as createV1ProfileApiClient } from '~/api-clients/profile-api/client';
import { createClient as createV1BalanceApiClient } from '~/api-clients/deprecated/balance-api/client';
import { createClient as createV2BalanceApiClient } from '~/api-clients/balance-api/client';

// The rest

const balanceApiClientV2 = createV2BalanceApiClient({
  baseUrl: process.env.BALANCE_SERVICE_URL,
});
balanceApiClientV2.interceptors.request.use(authInterceptor);

export {
  profileApiClientV1 as profileApiClient,
  balanceApiClientV1 as balanceApiClient,
  balanceApiClientV2,
};
```

## Usage

In the code than based on feature flags you can either use the old client or the new version of it.

## Cleanup

Once the integration/migration is done you can just update the exports in `packages/service-worker/src/api-clients/clients.ts` and cleanup the logic around feature flags in the code base

```javascript
import { container } from 'tsyringe';
import { AppCheckService } from '~/services/appcheck/AppCheckService';
import { createClient as createV1ProfileApiClient } from '~/api-clients/profile-api/client';
import { createClient as createV1BalanceApiClient } from '~/api-clients/deprecated/balance-api/client';
import { createClient as createV2BalanceApiClient } from '~/api-clients/balance-api/client';

// The rest

const balanceApiClientV2 = createV2BalanceApiClient({
  baseUrl: process.env.BALANCE_SERVICE_URL,
});
balanceApiClientV2.interceptors.request.use(authInterceptor);

export { profileApiClient, balanceApiClientV2 as balanceApiClient };
```
