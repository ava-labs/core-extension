import { container } from 'tsyringe';
import { AppCheckService } from '~/services/appcheck/AppCheckService';
import { createClient as createV1ProfileApiClient } from '~/api-clients/profile-api/client';
import { createClient as createV1BalanceApiClient } from '~/api-clients/balance-api/client';

const appcheckService = container.resolve(AppCheckService);

interface InterceptorRequest {
  headers: {
    set: (key: string, value: string) => void;
  };
}

const authInterceptor = async <T extends InterceptorRequest>(
  request: T,
): Promise<T> => {
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

export {
  profileApiClientV1 as profileApiClient,
  balanceApiClientV1 as balanceApiClient,
};
