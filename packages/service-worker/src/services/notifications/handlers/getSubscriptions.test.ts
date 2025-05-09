import { BalanceNotificationService } from '../BalanceNotificationService';
import { BalanceNotificationTypes, NewsNotificationTypes } from '@core/types';
import { NewsNotificationService } from '../NewsNotificationService';
import { GetNotificationSubscriptions } from './getSubscriptions';

describe('GetNotificationSubscriptions', () => {
  const requestMock = { params: [] };
  const balanceNotificationServiceMock = {
    getSubscriptions: jest.fn(),
  };
  const newsNotificationServiceMock = {
    getSubscriptions: jest.fn(),
  };
  const handler = new GetNotificationSubscriptions(
    balanceNotificationServiceMock as unknown as BalanceNotificationService,
    newsNotificationServiceMock as unknown as NewsNotificationService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an error when the request fails', async () => {
    const error = new Error('some-error');
    balanceNotificationServiceMock.getSubscriptions.mockRejectedValueOnce(
      error,
    );

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      error: error.toString(),
    });
  });

  it('should return the subscriptions', async () => {
    balanceNotificationServiceMock.getSubscriptions.mockResolvedValueOnce({
      [BalanceNotificationTypes.BALANCE_CHANGES]: true,
    });
    newsNotificationServiceMock.getSubscriptions.mockResolvedValueOnce({
      [NewsNotificationTypes.MARKET_NEWS]: true,
      [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
    });

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: {
        [BalanceNotificationTypes.BALANCE_CHANGES]: true,
        [NewsNotificationTypes.MARKET_NEWS]: true,
        [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
      },
    });
  });
});
