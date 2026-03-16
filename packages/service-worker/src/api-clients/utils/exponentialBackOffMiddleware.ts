import { wait } from '@avalabs/core-utils-sdk';
import { getExponentialBackoffDelay } from '@core/common';

type Client =
  | import('~/api-clients/balance-api/client').Client
  | import('~/api-clients/profile-api/client').Client
  | import('~/api-clients/token-aggregator/client').Client;

class TimeOutController {
  #attempt: number = 0;

  clear() {
    this.#attempt = 0;
  }

  bump() {
    this.#attempt++;
  }

  isRetryable(status: number) {
    return (status >= 500 && status < 600) || status === 429;
  }

  get attempt() {
    return this.#attempt;
  }
}

export function applyExponentialBackOffMiddleware(api: Client) {
  const controller = new TimeOutController();

  api.interceptors.request.use(async (request) => {
    if (controller.attempt > 0) {
      const waitTime = getExponentialBackoffDelay({
        attempt: controller.attempt,
      });
      await wait(waitTime);
    }
    return request;
  });

  api.interceptors.response.use((response) => {
    if (!response.ok && controller.isRetryable(response.status)) {
      controller.bump();
    } else {
      controller.clear();
    }
    return response;
  });
}
