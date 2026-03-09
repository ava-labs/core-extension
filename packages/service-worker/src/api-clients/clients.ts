import { container } from 'tsyringe';
import { createClient as createV1BalanceApiClient } from '~/api-clients/balance-api/client';
import { createClient as createV1ProfileApiClient } from '~/api-clients/profile-api/client';
import { createClient as createTokenAggregatorApiClientV1 } from '~/api-clients/token-aggregator/client';
import { AppCheckService } from '~/services/appcheck/AppCheckService';
import { applyExponentialBackOffMiddleware } from './utils/exponentialBackOffMiddleware';

const appcheckService = container.resolve(AppCheckService);

const authInterceptor = async <R extends Request>(request: R): Promise<R> => {
  const tokenResult = await appcheckService.getAppcheckToken();

  request.headers.set('x-firebase-appcheck', tokenResult?.token ?? '');
  return request;
};

const profileApiClientV1 = createV1ProfileApiClient({
  baseUrl: process.env.PROFILE_SERVICE_URL,
});
profileApiClientV1.interceptors.request.use(authInterceptor);

const balanceApiClientV1 = createV1BalanceApiClient({
  baseUrl: process.env.BALANCE_SERVICE_URL,
});
balanceApiClientV1.interceptors.request.use(authInterceptor);
applyExponentialBackOffMiddleware(balanceApiClientV1);

const tokenAggregatorApiClientV1 = createTokenAggregatorApiClientV1({
  baseUrl: process.env.TOKEN_AGGREGATOR_SERVICE_URL,
});
tokenAggregatorApiClientV1.interceptors.request.use(authInterceptor);

export {
  balanceApiClientV1 as balanceApiClient,
  profileApiClientV1 as profileApiClient,
  tokenAggregatorApiClientV1 as tokenAggregatorApiClient,
};
