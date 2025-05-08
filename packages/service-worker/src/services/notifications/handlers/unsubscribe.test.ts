import { BalanceNotificationService } from '../BalanceNotificationService';
import { BalanceNotificationTypes, NewsNotificationTypes } from '@core/types';
import { NewsNotificationService } from '../NewsNotificationService';
import { UnsubscribeFromNotification } from './unsubscribe';

describe('UnsubscribeToNotification', () => {
  const balanceNotificationServiceMock = {
    unsubscribe: jest.fn(),
  };
  const newsNotificationServiceMock = {
    unsubscribe: jest.fn(),
  };
  const handler = new UnsubscribeFromNotification(
    balanceNotificationServiceMock as unknown as BalanceNotificationService,
    newsNotificationServiceMock as unknown as NewsNotificationService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an error when the request fails', async () => {
    const requestMock = { params: BalanceNotificationTypes.BALANCE_CHANGES };
    const error = new Error('some-error');
    balanceNotificationServiceMock.unsubscribe.mockRejectedValueOnce(error);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      error: error.toString(),
    });
  });

  it('should unsubscribe from the balance notification', async () => {
    const requestMock = { params: BalanceNotificationTypes.BALANCE_CHANGES };
    balanceNotificationServiceMock.unsubscribe.mockResolvedValueOnce(undefined);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: true,
    });

    expect(balanceNotificationServiceMock.unsubscribe).toHaveBeenCalled();
    expect(newsNotificationServiceMock.unsubscribe).not.toHaveBeenCalled();
  });

  it('should unsubscribe from the news notification', async () => {
    const requestMock = { params: NewsNotificationTypes.MARKET_NEWS };
    newsNotificationServiceMock.unsubscribe.mockResolvedValueOnce(undefined);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: true,
    });

    expect(balanceNotificationServiceMock.unsubscribe).not.toHaveBeenCalled();
    expect(newsNotificationServiceMock.unsubscribe).toHaveBeenCalledWith(
      NewsNotificationTypes.MARKET_NEWS,
    );
  });
});
