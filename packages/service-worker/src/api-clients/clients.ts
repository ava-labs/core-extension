import { container } from 'tsyringe';
import { AppCheckService } from '~/services/appcheck/AppCheckService';
import { createClient as createProfileApiClient } from '~/api-clients/profile-api/client';
import { createClient as createBalanceApiClient } from '~/api-clients/balance-api/client';

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

const profileApiClient = createProfileApiClient({
  baseUrl: process.env.PROFILE_SERVICE_URL,
});
profileApiClient.interceptors.request.use(authInterceptor);
const balanceApiClient = createBalanceApiClient({
  baseUrl: process.env.BALANCE_SERVICE_URL,
});
balanceApiClient.interceptors.request.use(authInterceptor);

export { profileApiClient, balanceApiClient };
