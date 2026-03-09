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
      console.log('waiting for', waitTime);
      await wait(waitTime);
    }
    return request;
  });

  api.interceptors.response.use((response) => {
    if (!response.ok) {
      controller.bump();
    } else {
      controller.clear();
    }
    return response;
  });
}
