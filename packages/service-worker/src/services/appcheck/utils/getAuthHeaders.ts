import { container } from 'tsyringe';

import { Monitoring } from '@core/common';

import { AppCheckService } from '../AppCheckService';

const FIREBASE_APP_CHECK_HEADER = 'X-Firebase-AppCheck';
const CORE_PROXY_API_KEY_HEADER = 'X-Core-Api-Key';

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const appcheckToken = await _getAppcheckToken();

  return appcheckToken
    ? {
        [FIREBASE_APP_CHECK_HEADER]: appcheckToken,
        [CORE_PROXY_API_KEY_HEADER]: process.env.CORE_PROXY_API_KEY ?? '',
      }
    : {
        [CORE_PROXY_API_KEY_HEADER]: process.env.CORE_PROXY_API_KEY ?? '',
      };
};

const _getAppcheckToken = async (): Promise<string | undefined> => {
  try {
    const appCheckService = container.resolve(AppCheckService);
    const appcheckToken = await appCheckService.getAppcheckToken();
    return appcheckToken?.token;
  } catch (error) {
    Monitoring.sentryCaptureException(
      error as Error,
      Monitoring.SentryExceptionTypes.FIREBASE,
    );
    return undefined;
  }
};
