import { container } from 'tsyringe';
import { AppCheckService } from '../../appcheck/AppCheckService';

type Params = {
  path: string;
  clientId?: string;
  payload: Record<string, unknown>;
  includeAppType?: boolean;
};

export const sendRequest = async <T>({
  path,
  clientId,
  payload,
  includeAppType = true,
}: Params): Promise<T> => {
  const url = process.env.NOTIFICATION_SENDER_SERVICE_URL;

  if (!url) {
    throw new Error(
      'Missing environment variable "NOTIFICATION_SENDER_SERVICE_URL"',
    );
  }

  const appCheckService = container.resolve(AppCheckService);
  const { token: appcheckToken } =
    (await appCheckService.getAppcheckToken()) ?? {};

  if (!appcheckToken) {
    throw new Error(
      `Error while sending request to "${path}": Missing appCheckToken`,
    );
  }

  const response = await fetch(`${url}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Firebase-AppCheck': appcheckToken,
    },
    body: JSON.stringify({
      ...(includeAppType && { appType: 'CORE_EXTENSION' }),
      ...(clientId && { deviceArn: clientId }),
      ...payload,
    }),
  });

  if (!response.ok) {
    let errorBody = '';
    try {
      errorBody = await response.text();
    } catch {
      // Ignore if we can't read the body
    }
    throw new Error(
      `Error while sending request to "${path}": ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`,
    );
  }

  const result = (await response.json()) as T;
  return result;
};
