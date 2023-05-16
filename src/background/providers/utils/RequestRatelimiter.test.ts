import { ethErrors } from 'eth-rpc-errors';
import RequestRatelimiter from './RequestRatelimiter';

describe('src/background/providers/utils/RequestRatelimiter', () => {
  it('runs rate limited methods when none is inflight', async () => {
    const ratelimiter = new RequestRatelimiter(['eth_requestAccounts']);
    const callback = jest.fn();
    await ratelimiter.call('eth_requestAccounts', async () => {
      callback();
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('rejects rate limited methods when already one inflight', (done) => {
    const ratelimiter = new RequestRatelimiter(['eth_requestAccounts']);
    const callback = jest.fn();

    ratelimiter.call('eth_requestAccounts', async () => {
      // start another request while the first one is running
      try {
        await ratelimiter.call('eth_requestAccounts', async () => {
          callback();
        });
      } catch (e) {
        expect(e).toEqual(
          ethErrors.rpc.resourceUnavailable(
            `Request of type eth_requestAccounts already pending for origin. Please wait.`
          )
        );
      }

      expect(callback).not.toHaveBeenCalled();
      done();
    });
  });

  it('allows subsequent calls to the same rate-limited method after the previous calls complete', async () => {
    const ratelimiter = new RequestRatelimiter(['eth_requestAccounts']);
    const callback = jest.fn();
    await ratelimiter.call('eth_requestAccounts', async () => {
      callback();
    });
    await ratelimiter.call('eth_requestAccounts', async () => {
      callback();
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('allows other methods when a rate limited one is running', (done) => {
    const ratelimiter = new RequestRatelimiter(['eth_requestAccounts']);
    const callback = jest.fn();

    ratelimiter.call('eth_requestAccounts', async () => {
      // start another request while the first one is running
      await ratelimiter.call('eth_chainId', async () => {
        callback();
      });

      expect(callback).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('allows multiple calls of non rate limited methods', (done) => {
    const ratelimiter = new RequestRatelimiter(['eth_requestAccounts']);
    const callback = jest.fn();

    ratelimiter.call('eth_chainId', async () => {
      // start another request while the first one is running
      await ratelimiter.call('eth_chainId', async () => {
        callback();
      });

      expect(callback).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
