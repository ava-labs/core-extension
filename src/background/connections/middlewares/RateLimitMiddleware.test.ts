import { DAppProviderRequest } from '../dAppConnection/models';
import { RateLimitMiddleware } from './RateLimitMiddleware';

describe('background/connections/middlewares/RateLimitMiddleware.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call next if method is not connect', async () => {
    const target = RateLimitMiddleware();
    const context = {
      request: {
        id: 'id',
        method: DAppProviderRequest.ETH_ACCOUNTS,
        data: { method: DAppProviderRequest.ETH_ACCOUNTS },
      },
      authenticated: true,
    };
    const next = jest.fn();
    const error = jest.fn();
    await target(context, next, error);
    expect(next).toBeCalledTimes(1);
    expect(error).toBeCalledTimes(0);
  });

  it('should call error if method is connect and it has been less than 300ms', async () => {
    const target = RateLimitMiddleware();
    const context = {
      request: {
        id: 'id',
        method: DAppProviderRequest.CONNECT_METHOD,
        data: { method: DAppProviderRequest.CONNECT_METHOD },
      },
      authenticated: true,
    };
    const next = jest.fn();
    const error = jest.fn();
    await target(context, next, error);
    await target(context, next, error);
    expect(next).toBeCalledTimes(1);
    expect(error).toBeCalledTimes(1);
  });

  it('should call next and callback if method is connect and it has been more than 300ms', async () => {
    const target = RateLimitMiddleware();
    const context = {
      request: {
        id: 'id',
        method: DAppProviderRequest.CONNECT_METHOD,
        data: { method: DAppProviderRequest.CONNECT_METHOD },
      },
      authenticated: true,
    };
    const next = jest.fn();
    const error = jest.fn();
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);

    await target(context, next, error);
    jest.spyOn(Date, 'now').mockReturnValue(now + 300);

    await target(context, next, error);
    expect(next).toBeCalledTimes(2);
    expect(error).toBeCalledTimes(0);
  });
});
