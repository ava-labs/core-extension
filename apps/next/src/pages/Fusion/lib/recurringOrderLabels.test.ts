import type { TFunction } from 'i18next';

import type { RecurringSwapOrder } from '../hooks/useRecurringSwapOrders';

import {
  getRecurringOrderExecutedLabel,
  getRecurringOrderScheduleLabel,
  isUnlimitedRecurringOrder,
} from './recurringOrderLabels';

// Mirrors i18next's key-fallback behavior: return the key and interpolate any
// `{{placeholders}}` from the passed values.
const t = ((key: string, opts?: Record<string, unknown>) =>
  opts
    ? key.replace(/{{(\w+)}}/g, (_, name: string) => String(opts[name]))
    : key) as unknown as TFunction;

const createOrder = (
  overrides: Partial<RecurringSwapOrder> = {},
): RecurringSwapOrder => ({
  id: '0xabc',
  status: 'active',
  sourceToken: { symbol: 'USDC', coreChainId: 43114 },
  targetToken: { symbol: 'AVAX', coreChainId: 43114 },
  amountPerSwap: 5,
  frequencyQuantity: 1,
  frequencyUnit: 'week',
  ordersTotal: 4,
  ordersExecuted: 1,
  nextSwapAt: null,
  ...overrides,
});

describe('isUnlimitedRecurringOrder', () => {
  it('treats the -1 sentinel as unlimited', () => {
    expect(isUnlimitedRecurringOrder(createOrder({ ordersTotal: -1 }))).toBe(
      true,
    );
  });

  it('treats a non-positive total as unlimited', () => {
    expect(isUnlimitedRecurringOrder(createOrder({ ordersTotal: 0 }))).toBe(
      true,
    );
  });

  it('treats a positive total as finite', () => {
    expect(isUnlimitedRecurringOrder(createOrder({ ordersTotal: 4 }))).toBe(
      false,
    );
  });
});

describe('getRecurringOrderExecutedLabel', () => {
  it('renders the executed / total fraction for finite schedules', () => {
    expect(
      getRecurringOrderExecutedLabel(
        createOrder({ ordersExecuted: 1, ordersTotal: 4 }),
        t,
      ),
    ).toBe('1 of 4');
  });

  it('renders just the executed count for unlimited schedules', () => {
    expect(
      getRecurringOrderExecutedLabel(
        createOrder({ ordersExecuted: 3, ordersTotal: -1 }),
        t,
      ),
    ).toBe('3 completed');
  });
});

describe('getRecurringOrderScheduleLabel', () => {
  it('renders the order total for finite schedules', () => {
    expect(
      getRecurringOrderScheduleLabel(createOrder({ ordersTotal: 4 }), t),
    ).toBe('Every 1 week · 4 orders total');
  });

  it('renders an open-ended schedule without a total for unlimited orders', () => {
    expect(
      getRecurringOrderScheduleLabel(createOrder({ ordersTotal: -1 }), t),
    ).toBe('Every 1 week · No end date');
  });
});
