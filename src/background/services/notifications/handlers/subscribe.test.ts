import { BalanceNotificationService } from '../BalanceNotificationService';
import { BalanceNotificationTypes, NewsNotificationTypes } from '../models';
import { NewsNotificationService } from '../NewsNotificationService';
import { SubscribeToNotification } from './subscribe';

describe('SubscribeToNotification', () => {
  const balanceNotificationServiceMock = {
    subscribe: jest.fn(),
  };
  const newsNotificationServiceMock = {
    subscribe: jest.fn(),
  };
  const handler = new SubscribeToNotification(
    balanceNotificationServiceMock as unknown as BalanceNotificationService,
    newsNotificationServiceMock as unknown as NewsNotificationService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an error when the request fails', async () => {
    const requestMock = { params: BalanceNotificationTypes.BALANCE_CHANGES };
    const error = new Error('some-error');
    balanceNotificationServiceMock.subscribe.mockRejectedValueOnce(error);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      error: error.toString(),
    });
  });

  it('should subscribe to the balance notification', async () => {
    const requestMock = { params: BalanceNotificationTypes.BALANCE_CHANGES };
    balanceNotificationServiceMock.subscribe.mockResolvedValueOnce(undefined);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: true,
    });

    expect(balanceNotificationServiceMock.subscribe).toHaveBeenCalled();
    expect(newsNotificationServiceMock.subscribe).not.toHaveBeenCalled();
  });

  it('should subscribe to the news notification', async () => {
    const requestMock = { params: NewsNotificationTypes.MARKET_NEWS };
    newsNotificationServiceMock.subscribe.mockResolvedValueOnce(undefined);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: true,
    });

    expect(balanceNotificationServiceMock.subscribe).not.toHaveBeenCalled();
    expect(newsNotificationServiceMock.subscribe).toHaveBeenCalledWith([
      NewsNotificationTypes.MARKET_NEWS,
    ]);
  });
});
