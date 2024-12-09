import { ethErrors } from 'eth-rpc-errors';

class RequestRatelimiter {
  #rateLimitedMethods: string[];
  #requestsInflight: Record<string, number> = {};

  constructor(rateLimitedMethods: string[]) {
    this.#rateLimitedMethods = rateLimitedMethods;
  }

  async call(key: string, defer: () => Promise<any>) {
    if (this.#rateLimitedMethods.includes(key) && this.#requestsInflight[key]) {
      throw ethErrors.rpc.resourceUnavailable(
        `Request of type ${key} already pending for origin. Please wait.`,
      );
    }

    return new Promise((resolve) => {
      this.#requestsInflight[key] = (this.#requestsInflight[key] || 0) + 1;

      resolve(
        defer().finally(() => {
          this.#requestsInflight[key]--;
          if (!this.#requestsInflight[key]) {
            delete this.#requestsInflight[key];
          }
        }),
      );
    });
  }
}

export default RequestRatelimiter;
