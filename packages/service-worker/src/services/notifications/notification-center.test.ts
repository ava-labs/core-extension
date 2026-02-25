import {
  AppNotification,
  NotificationCategory,
  NotificationTab,
  NotificationResponse,
  filterByTab,
  mapTypeToCategory,
  isPriceAlertNotification,
  isBalanceChangeNotification,
  transformNotification,
} from '@core/types';

const makeNotification = (
  overrides: Partial<AppNotification> &
    Pick<AppNotification, 'type' | 'category'>,
): AppNotification =>
  ({
    id: 'test-1',
    title: 'Test',
    body: 'Test body',
    timestamp: 1000,
    ...overrides,
  }) as AppNotification;

const balanceChange = makeNotification({
  type: 'BALANCE_CHANGES',
  category: NotificationCategory.TRANSACTION,
});

const priceAlert = makeNotification({
  id: 'test-2',
  type: 'PRICE_ALERTS',
  category: NotificationCategory.PRICE_UPDATE,
});

const news = makeNotification({
  id: 'test-3',
  type: 'NEWS',
  category: NotificationCategory.NEWS,
});

const allNotifications = [balanceChange, priceAlert, news];

describe('mapTypeToCategory', () => {
  it('maps BALANCE_CHANGES to TRANSACTION', () => {
    expect(mapTypeToCategory('BALANCE_CHANGES')).toBe(
      NotificationCategory.TRANSACTION,
    );
  });

  it('maps PRICE_ALERTS to PRICE_UPDATE', () => {
    expect(mapTypeToCategory('PRICE_ALERTS')).toBe(
      NotificationCategory.PRICE_UPDATE,
    );
  });

  it('maps NEWS to NEWS', () => {
    expect(mapTypeToCategory('NEWS')).toBe(NotificationCategory.NEWS);
  });
});

describe('filterByTab', () => {
  it('returns all notifications for ALL tab', () => {
    expect(filterByTab(allNotifications, NotificationTab.ALL)).toEqual(
      allNotifications,
    );
  });

  it('returns only transactions for TRANSACTIONS tab', () => {
    const result = filterByTab(allNotifications, NotificationTab.TRANSACTIONS);
    expect(result).toEqual([balanceChange]);
  });

  it('returns only price updates for PRICE_UPDATES tab', () => {
    const result = filterByTab(allNotifications, NotificationTab.PRICE_UPDATES);
    expect(result).toEqual([priceAlert]);
  });

  it('returns empty array when no notifications match tab', () => {
    const result = filterByTab([news], NotificationTab.TRANSACTIONS);
    expect(result).toEqual([]);
  });

  it('returns empty array when input is empty', () => {
    expect(filterByTab([], NotificationTab.ALL)).toEqual([]);
  });
});

describe('isPriceAlertNotification', () => {
  it('returns true for PRICE_ALERTS type', () => {
    expect(isPriceAlertNotification(priceAlert)).toBe(true);
  });

  it('returns false for other types', () => {
    expect(isPriceAlertNotification(balanceChange)).toBe(false);
    expect(isPriceAlertNotification(news)).toBe(false);
  });
});

describe('isBalanceChangeNotification', () => {
  it('returns true for BALANCE_CHANGES type', () => {
    expect(isBalanceChangeNotification(balanceChange)).toBe(true);
  });

  it('returns false for other types', () => {
    expect(isBalanceChangeNotification(priceAlert)).toBe(false);
    expect(isBalanceChangeNotification(news)).toBe(false);
  });
});

describe('transformNotification', () => {
  it('transforms BALANCE_CHANGES notification with valid metadata', () => {
    const response: NotificationResponse = {
      notificationId: 'bc-1',
      type: 'BALANCE_CHANGES',
      title: '0.5 AVAX sent',
      body: 'to 0xabc...',
      createdAt: 1700000000,
      metadata: {
        event: 'BALANCES_SPENT',
        chainId: '43114',
        chainName: 'Avalanche',
        transactionHash: '0xhash',
        accountAddress: '0xaccount',
        url: 'https://example.com/tx/0xhash',
        transfers: [
          {
            tokenSymbol: 'AVAX',
            amount: '0.5',
            partnerAddress: '0xpartner',
          },
        ],
      },
    };

    const result = transformNotification(response);

    expect(result.id).toBe('bc-1');
    expect(result.type).toBe('BALANCE_CHANGES');
    expect(result.category).toBe(NotificationCategory.TRANSACTION);
    expect(result.title).toBe('0.5 AVAX sent');
    expect(result.timestamp).toBe(1700000000);
    expect(result.deepLinkUrl).toBe('https://example.com/tx/0xhash');
    expect(result.data).toBeDefined();
    if (result.type === 'BALANCE_CHANGES') {
      expect(result.data?.event).toBe('BALANCES_SPENT');
      expect(result.data?.chainId).toBe('43114');
      expect(result.data?.transfers).toHaveLength(1);
    }
  });

  it('transforms PRICE_ALERTS notification with valid metadata', () => {
    const response: NotificationResponse = {
      notificationId: 'pa-1',
      type: 'PRICE_ALERTS',
      title: 'AVAX reached $50',
      body: 'Price update',
      createdAt: 1700000001,
      metadata: {
        tokenId: 'avax',
        tokenName: 'Avalanche',
        tokenSymbol: 'AVAX',
        currentPrice: 50,
        priceChangePercent: 5.2,
        url: 'https://example.com/price/avax',
      },
    };

    const result = transformNotification(response);

    expect(result.id).toBe('pa-1');
    expect(result.type).toBe('PRICE_ALERTS');
    expect(result.category).toBe(NotificationCategory.PRICE_UPDATE);
    expect(result.deepLinkUrl).toBe('https://example.com/price/avax');
    if (result.type === 'PRICE_ALERTS') {
      expect(result.data?.currentPrice).toBe(50);
      expect(result.data?.priceChangePercent).toBe(5.2);
    }
  });

  it('transforms NEWS notification', () => {
    const response: NotificationResponse = {
      notificationId: 'news-1',
      type: 'NEWS',
      title: 'New feature',
      body: 'Check it out',
      createdAt: 1700000002,
      metadata: {
        event: 'PRODUCT_ANNOUNCEMENTS',
        url: 'https://example.com/news',
      },
    };

    const result = transformNotification(response);

    expect(result.id).toBe('news-1');
    expect(result.type).toBe('NEWS');
    expect(result.category).toBe(NotificationCategory.NEWS);
    expect(result.deepLinkUrl).toBe('https://example.com/news');
  });

  it('transforms NEWS-wrapped PRICE_ALERTS to PRICE_ALERTS type', () => {
    const response: NotificationResponse = {
      notificationId: 'npa-1',
      type: 'NEWS',
      title: 'ETH reached $3000',
      body: 'Price alert',
      createdAt: 1700000003,
      metadata: {
        event: 'PRICE_ALERTS',
        url: 'https://example.com/price/eth',
        data: [
          {
            tokenName: 'Ethereum',
            currentPrice: 3000,
            tokenId: 'eth',
            tokenSymbol: 'ETH',
            priceChangePercent: 2.5,
          },
        ],
      },
    };

    const result = transformNotification(response);

    expect(result.type).toBe('PRICE_ALERTS');
    expect(result.category).toBe(NotificationCategory.PRICE_UPDATE);
    if (result.type === 'PRICE_ALERTS') {
      expect(result.data?.tokenSymbol).toBe('ETH');
      expect(result.data?.currentPrice).toBe(3000);
      expect(result.data?.priceChangePercent).toBe(2.5);
    }
  });

  it('handles missing metadata gracefully', () => {
    const response: NotificationResponse = {
      notificationId: 'no-meta',
      type: 'BALANCE_CHANGES',
      title: 'Test',
      body: 'No metadata',
      createdAt: 1700000004,
    };

    const result = transformNotification(response);

    expect(result.id).toBe('no-meta');
    expect(result.type).toBe('BALANCE_CHANGES');
    expect(result.deepLinkUrl).toBeUndefined();
    if (result.type === 'BALANCE_CHANGES') {
      expect(result.data).toBeUndefined();
    }
  });

  it('handles invalid metadata by setting data to undefined', () => {
    const response: NotificationResponse = {
      notificationId: 'bad-meta',
      type: 'PRICE_ALERTS',
      title: 'Test',
      body: 'Bad metadata',
      createdAt: 1700000005,
      metadata: {
        url: 'https://example.com',
      },
    };

    const result = transformNotification(response);

    expect(result.type).toBe('PRICE_ALERTS');
    if (result.type === 'PRICE_ALERTS') {
      expect(result.data).toBeUndefined();
    }
  });
});
