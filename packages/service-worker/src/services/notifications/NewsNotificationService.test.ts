import { FirebaseService } from '../firebase/FirebaseService';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
} from './constants';
import { NewsNotificationTypes, NotificationCategories } from '@core/types';
import { NewsNotificationService } from './NewsNotificationService';
import { sendNotification } from './utils/sendNotification';
import { sendRequest } from './utils/sendRequest';

jest.mock('./utils/sendRequest');
jest.mock('./utils/sendNotification');

describe('NewsNotificationService', () => {
  const storageServiceMock = {
    load: jest.fn(),
    save: jest.fn(),
  };
  const firebaseServiceMock = {
    addFcmMessageListener: jest.fn(),
  };
  const createNewsNotificationService = (locked: boolean) =>
    new NewsNotificationService(
      storageServiceMock as unknown as StorageService,
      firebaseServiceMock as unknown as FirebaseService,
      { locked } as unknown as LockService,
    );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should subscribe to FCM_MESSAGE event', async () => {
    const newsNotificationService = createNewsNotificationService(true);
    await newsNotificationService.init('deviceArn');

    expect(firebaseServiceMock.addFcmMessageListener).toHaveBeenCalledWith(
      NotificationCategories.NEWS,
      expect.any(Function),
    );
    expect(sendRequest).not.toHaveBeenCalled();
  });

  describe('subscribe', () => {
    it('should throw an error if the notification type is invalid', async () => {
      const newsNotificationService = createNewsNotificationService(false);
      await newsNotificationService.init('deviceArn');

      jest.clearAllMocks();

      await expect(
        newsNotificationService.subscribe([
          'INVALID',
        ] as unknown as NewsNotificationTypes[]),
      ).rejects.toThrow('Invalid notification type provided');
      expect(sendRequest).not.toHaveBeenCalled();
    });

    it('should refresh subscriptions on init', async () => {
      storageServiceMock.load.mockResolvedValueOnce({
        [NewsNotificationTypes.MARKET_NEWS]: true,
        [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
        [NewsNotificationTypes.PRICE_ALERTS]: false,
        [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
      });

      const newsNotificationService = createNewsNotificationService(false);
      await newsNotificationService.init('deviceArn');

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/news/subscribe',
        clientId: 'deviceArn',
        payload: {
          events: [
            NewsNotificationTypes.MARKET_NEWS,
            NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS,
          ],
        },
      });

      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
        {
          [NewsNotificationTypes.MARKET_NEWS]: true,
          [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
          [NewsNotificationTypes.PRICE_ALERTS]: false,
          [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
        },
      );
    });

    it('should refresh subscriptions on unlock', async () => {
      const newsNotificationService = createNewsNotificationService(false);
      await newsNotificationService.init('deviceArn');

      jest.clearAllMocks();

      storageServiceMock.load.mockResolvedValueOnce({
        [NewsNotificationTypes.MARKET_NEWS]: true,
        [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
        [NewsNotificationTypes.PRICE_ALERTS]: false,
        [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
      });

      await newsNotificationService.onUnlock();

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/news/subscribe',
        clientId: 'deviceArn',
        payload: {
          events: [
            NewsNotificationTypes.MARKET_NEWS,
            NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS,
          ],
        },
      });
      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
        {
          [NewsNotificationTypes.MARKET_NEWS]: true,
          [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
          [NewsNotificationTypes.PRICE_ALERTS]: false,
          [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
        },
      );
    });

    it('should subscribe to new notification types', async () => {
      const newsNotificationService = createNewsNotificationService(false);
      await newsNotificationService.init('deviceArn');

      jest.clearAllMocks();

      storageServiceMock.load.mockResolvedValueOnce({
        [NewsNotificationTypes.MARKET_NEWS]: true,
        [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
        [NewsNotificationTypes.PRICE_ALERTS]: false,
        [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
      });

      await newsNotificationService.subscribe([
        NewsNotificationTypes.PRICE_ALERTS,
      ]);

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/news/subscribe',
        clientId: 'deviceArn',
        payload: {
          events: [
            NewsNotificationTypes.MARKET_NEWS,
            NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS,
            NewsNotificationTypes.PRICE_ALERTS,
          ],
        },
      });

      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
        {
          [NewsNotificationTypes.MARKET_NEWS]: true,
          [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
          [NewsNotificationTypes.PRICE_ALERTS]: true,
          [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
        },
      );
    });
  });

  describe('unsubscribe', () => {
    it('should throw an error if the notification type is invalid', async () => {
      const newsNotificationService = createNewsNotificationService(false);
      await newsNotificationService.init('deviceArn');

      await expect(
        newsNotificationService.unsubscribe('INVALID' as NewsNotificationTypes),
      ).rejects.toThrow('Invalid notification type INVALID');
    });

    it('should unsubscribe from a notification type', async () => {
      const newsNotificationService = createNewsNotificationService(false);
      await newsNotificationService.init('deviceArn');

      storageServiceMock.load.mockResolvedValueOnce({
        [NewsNotificationTypes.MARKET_NEWS]: true,
        [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
        [NewsNotificationTypes.PRICE_ALERTS]: false,
        [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
      });

      await newsNotificationService.unsubscribe(
        NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS,
      );

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/news/unsubscribe',
        clientId: 'deviceArn',
        payload: { events: [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS] },
      });

      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
        {
          [NewsNotificationTypes.MARKET_NEWS]: true,
          [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: false,
          [NewsNotificationTypes.PRICE_ALERTS]: false,
          [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
        },
      );
    });
  });

  it('should send a notification when a new message is received', async () => {
    const newsNotificationService = createNewsNotificationService(false);
    await newsNotificationService.init('deviceArn');

    // simulate FCM_MESSAGE event
    jest
      .mocked(firebaseServiceMock.addFcmMessageListener)
      .mock.calls[0]?.[1]({ data: { foo: 'bar' } });

    expect(sendNotification).toHaveBeenCalledWith({
      payload: { data: { foo: 'bar' } },
      allowedType: NotificationCategories.NEWS,
      allowedEvents: NOTIFICATION_CATEGORIES.NEWS,
    });
  });

  it('should return the current subscriptions', async () => {
    const newsNotificationService = createNewsNotificationService(false);
    await newsNotificationService.init('deviceArn');

    storageServiceMock.load.mockResolvedValueOnce({
      [NewsNotificationTypes.MARKET_NEWS]: true,
      [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
      [NewsNotificationTypes.PRICE_ALERTS]: false,
      [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
    });

    const subscriptions = await newsNotificationService.getSubscriptions();

    expect(subscriptions).toStrictEqual({
      [NewsNotificationTypes.MARKET_NEWS]: true,
      [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: true,
      [NewsNotificationTypes.PRICE_ALERTS]: false,
      [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
    });
  });
});
