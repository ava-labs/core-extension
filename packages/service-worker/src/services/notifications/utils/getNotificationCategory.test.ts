import {
  BalanceNotificationTypes,
  NewsNotificationTypes,
  NotificationCategories,
  NotificationTypes,
} from '@core/types';
import { getNotificationCategory } from './getNotificationCategory';

describe('getNotificationCategory', () => {
  const events = [
    ...Object.values(BalanceNotificationTypes).map((type) => ({
      type,
      expectedCategory: NotificationCategories.BALANCE_CHANGES,
    })),
    ...Object.values(NewsNotificationTypes).map((type) => ({
      type,
      expectedCategory: NotificationCategories.NEWS,
    })),
  ];

  it('should throw error for unknown categories', () => {
    expect(() =>
      getNotificationCategory('unknown' as unknown as NotificationTypes),
    ).toThrow('Unknown notification type: unknown');
  });

  it.each(events)(
    'should return the correct category for $type',
    ({ type, expectedCategory }) => {
      expect(getNotificationCategory(type)).toBe(expectedCategory);
    },
  );
});
