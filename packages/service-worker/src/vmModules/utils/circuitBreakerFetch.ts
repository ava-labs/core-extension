import { getExponentialBackoffDelay } from '@core/common';

type FetchInput = Parameters<typeof fetch>[0];

class RequestBreaker {
  #originAttemptTracker = new Map<string, number>();
  #breakingState = new Map<string, boolean>();
  #maxDelay = 30000;

  /**
   * Asserts that the origin is not in a breaking state.
   * @param input - The input to the fetch function.
   * @throws {RequestBreakerError} if the origin is in a breaking state.
   */
  breakIfNeeded(input: FetchInput): void {
    const url = this.#getRequestUrl(input);
    const { origin } = url;
    if (this.#breakingState.get(origin) ?? false) {
      throw new RequestBreakerError(url);
    }
  }

  shouldTrigger(response: Response): boolean {
    return (
      !response.ok &&
      ((response.status >= 500 && response.status < 600) ||
        response.status === 429)
    );
  }

  reset(url: FetchInput): void {
    const { origin } = this.#getRequestUrl(url);
    this.#originAttemptTracker.delete(origin);
    this.#breakingState.delete(origin);
  }

  trigger(url: FetchInput, headers: Headers) {
    const { origin } = this.#getRequestUrl(url);

    this.#breakingState.set(origin, true);

    const attempt = this.#originAttemptTracker.get(origin) ?? 0;
    const nextAttempt = attempt + 1;
    this.#originAttemptTracker.set(origin, nextAttempt);

    const delay = this.#getDelay(origin, headers);
    setTimeout(() => this.#breakingState.set(origin, false), delay);
  }

  #getRequestUrl(request: FetchInput): URL {
    return request instanceof URL
      ? request
      : new URL(typeof request === 'string' ? request : request.url);
  }

  #getDelay(origin: string, headers?: Headers): number {
    if (!headers || !headers.has('Retry-After')) {
      return getExponentialBackoffDelay({
        attempt: this.#originAttemptTracker.get(origin)!,
        maxDelay: this.#maxDelay,
      });
    }

    const retryAfter = (headers.get('Retry-After') ?? '0').trim();

    if (/^\d+$/.test(retryAfter)) {
      const seconds = Number.parseInt(retryAfter, 10);
      return Math.min(seconds * 1000, this.#maxDelay);
    }

    const dateMs = Date.parse(retryAfter);

    if (Number.isNaN(dateMs)) {
      return this.#getDelay(origin);
    }

    const delta = Math.max(0, dateMs - Date.now());
    return Math.min(delta, this.#maxDelay);
  }
}

class RequestBreakerError extends Error {
  constructor(url: URL) {
    super(`The request to ${url} has been stopped by the circuit breaker.`);
    this.name = 'RequestBreakerError';
  }
}

const breaker = new RequestBreaker();

export async function circuitBreakerFetch(
  ...[input, init]: Parameters<typeof fetch>
): Promise<Response> {
  breaker.breakIfNeeded(input);

  const response = await fetch(input, init);

  if (breaker.shouldTrigger(response)) {
    breaker.trigger(input, response.headers);
  } else {
    breaker.reset(input);
  }

  return response;
}
