import { z } from 'zod';

/**
 * Notification type from backend
 */
export const NotificationTypeSchema = z.enum([
  'BALANCE_CHANGES',
  'PRICE_ALERTS',
  'NEWS',
]);

/**
 * Balance change event types
 */
export const BalanceChangeEventSchema = z.enum([
  'BALANCES_SPENT',
  'BALANCES_RECEIVED',
  'BALANCES_TRANSFERRED',
  'ALLOWANCE_APPROVED',
]);

/**
 * News event types
 */
export const NewsEventSchema = z.enum([
  'PRODUCT_ANNOUNCEMENTS',
  'OFFERS_AND_PROMOTIONS',
  'MARKET_NEWS',
  'PRICE_ALERTS',
]);

/**
 * Balance changes transfer schema
 */
export const BalanceChangesTransferSchema = z.object({
  tokenSymbol: z.string(),
  amount: z.string(),
  partnerAddress: z.string(),
});

/**
 * Balance changes metadata schema
 */
export const BalanceChangesMetadataSchema = z.object({
  event: BalanceChangeEventSchema,
  chainId: z.string(),
  chainName: z.string(),
  transactionHash: z.string(),
  accountAddress: z.string(),
  transfers: z.array(BalanceChangesTransferSchema).optional(),
  url: z.string(),
});

/**
 * Price alerts metadata schema
 */
export const PriceAlertsMetadataSchema = z.object({
  tokenId: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  currentPrice: z.number(),
  priceChangePercent: z.number(),
  url: z.string(),
});

/**
 * Price alert data item inside NEWS-wrapped price alerts
 */
export const PriceAlertDataItemSchema = z.object({
  tokenName: z.string(),
  currentPrice: z.number(),
  tokenId: z.string(),
  tokenSymbol: z.string(),
  priceChangePercent: z.number(),
});

/**
 * NEWS-wrapped price alert metadata schema.
 * Backend sends price alerts as type:"NEWS" with event:"PRICE_ALERTS"
 * and price data in a data[] array.
 */
export const NewsPriceAlertMetadataSchema = z.object({
  event: z.literal('PRICE_ALERTS'),
  url: z.string(),
  data: z.array(PriceAlertDataItemSchema).min(1),
});

/**
 * News metadata schema
 */
export const NewsMetadataSchema = z.object({
  event: z.string(),
  url: z.string(),
});

/**
 * Notification data payload from backend (generic for parsing)
 */
export const NotificationDataSchema = z
  .object({
    url: z.string().optional(),
    transactionHash: z.string().optional(),
    chainId: z.string().optional(),
    chainName: z.string().optional(),
    accountAddress: z.string().optional(),
    tokenSymbol: z.string().optional(),
    tokenName: z.string().optional(),
    tokenId: z.string().optional(),
    amount: z.string().optional(),
    event: z
      .union([BalanceChangeEventSchema, NewsEventSchema, z.string()])
      .optional(),
    partnerAddress: z.string().optional(),
    transfers: z.array(BalanceChangesTransferSchema).optional(),
    priceChangePercent: z.number().optional(),
    currentPrice: z.number().optional(),
  })
  .passthrough();

/**
 * Backend notification response schema
 * Note: API returns notificationId/createdAt, we transform to id/timestamp
 */
export const NotificationResponseSchema = z.object({
  notificationId: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  body: z.string(),
  createdAt: z.number(),
  metadata: NotificationDataSchema.optional(),
});

/**
 * List notifications response
 */
export const NotificationListResponseSchema = z.object({
  notifications: z.array(NotificationResponseSchema),
});

/**
 * Generic success response
 * API returns { success: true, updatedCount?: number }
 */
export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  updatedCount: z.number().optional(),
});

/**
 * Inferred types from Zod schemas
 */
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationData = z.infer<typeof NotificationDataSchema>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;
export type BalanceChangeEvent = z.infer<typeof BalanceChangeEventSchema>;
export type NewsEvent = z.infer<typeof NewsEventSchema>;
export type BalanceChangesTransfer = z.infer<
  typeof BalanceChangesTransferSchema
>;
export type BalanceChangesMetadata = z.infer<
  typeof BalanceChangesMetadataSchema
>;
export type PriceAlertsMetadata = z.infer<typeof PriceAlertsMetadataSchema>;
export type NewsMetadata = z.infer<typeof NewsMetadataSchema>;

/**
 * Notification categories mapping to UI tabs
 */
export enum NotificationCategory {
  TRANSACTION = 'TRANSACTION',
  PRICE_UPDATE = 'PRICE_UPDATE',
  NEWS = 'NEWS',
}

/**
 * Tab options for filtering notifications
 */
export enum NotificationTab {
  ALL = 'ALL',
  TRANSACTIONS = 'TRANSACTIONS',
  PRICE_UPDATES = 'PRICE_UPDATES',
}

/**
 * Base notification interface
 */
export interface BaseNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  timestamp: number;
  deepLinkUrl?: string;
}

/**
 * Backend notification with typed metadata based on notification type
 */
export type BackendNotification =
  | (BaseNotification & {
      type: 'BALANCE_CHANGES';
      data?: BalanceChangesMetadata;
    })
  | (BaseNotification & {
      type: 'PRICE_ALERTS';
      data?: PriceAlertsMetadata;
    })
  | (BaseNotification & {
      type: 'NEWS';
      data?: NewsMetadata;
    });

/**
 * Union type for all notifications (used in UI)
 */
export type AppNotification = BackendNotification;

/**
 * Type guard for price alert notifications
 */
export function isPriceAlertNotification(
  notification: AppNotification,
): notification is BaseNotification & {
  type: 'PRICE_ALERTS';
  data?: PriceAlertsMetadata;
} {
  return notification.type === 'PRICE_ALERTS';
}

/**
 * Type guard for balance change notifications
 */
export function isBalanceChangeNotification(
  notification: AppNotification,
): notification is BaseNotification & {
  type: 'BALANCE_CHANGES';
  data?: BalanceChangesMetadata;
} {
  return notification.type === 'BALANCE_CHANGES';
}

/**
 * Map notification type to category for UI tabs
 */
export function mapTypeToCategory(
  type: NotificationType,
): NotificationCategory {
  switch (type) {
    case 'BALANCE_CHANGES':
      return NotificationCategory.TRANSACTION;
    case 'PRICE_ALERTS':
      return NotificationCategory.PRICE_UPDATE;
    case 'NEWS':
    default:
      return NotificationCategory.NEWS;
  }
}

/**
 * Filter notifications by tab
 */
export function filterByTab(
  notifications: AppNotification[],
  tab: NotificationTab,
): AppNotification[] {
  switch (tab) {
    case NotificationTab.ALL:
      return notifications;
    case NotificationTab.TRANSACTIONS:
      return notifications.filter(
        (n) => n.category === NotificationCategory.TRANSACTION,
      );
    case NotificationTab.PRICE_UPDATES:
      return notifications.filter(
        (n) => n.category === NotificationCategory.PRICE_UPDATE,
      );
    default:
      return notifications;
  }
}

/**
 * Transform API notification response to app notification format.
 * API returns: notificationId, createdAt, metadata
 * App uses: id, timestamp, data
 */
export function transformNotification(
  response: NotificationResponse,
): BackendNotification {
  const base = {
    id: response.notificationId,
    category: mapTypeToCategory(response.type),
    title: response.title,
    body: response.body,
    timestamp: response.createdAt,
    deepLinkUrl: response.metadata?.url,
  };

  switch (response.type) {
    case 'BALANCE_CHANGES': {
      const parsed = BalanceChangesMetadataSchema.safeParse(response.metadata);
      return {
        ...base,
        type: 'BALANCE_CHANGES',
        data: parsed.success ? parsed.data : undefined,
      };
    }
    case 'PRICE_ALERTS': {
      const parsed = PriceAlertsMetadataSchema.safeParse(response.metadata);
      return {
        ...base,
        type: 'PRICE_ALERTS',
        data: parsed.success ? parsed.data : undefined,
      };
    }
    case 'NEWS': {
      // Check if this is a NEWS-wrapped price alert (type:"NEWS" + event:"PRICE_ALERTS")
      const priceAlert = NewsPriceAlertMetadataSchema.safeParse(
        response.metadata,
      );
      if (priceAlert.success) {
        const priceData = priceAlert.data.data[0]!;
        return {
          ...base,
          category: mapTypeToCategory('PRICE_ALERTS'),
          type: 'PRICE_ALERTS' as const,
          data: {
            ...priceData,
            url: priceAlert.data.url,
          },
        };
      }

      const parsed = NewsMetadataSchema.safeParse(response.metadata);
      return {
        ...base,
        type: 'NEWS',
        data: parsed.success ? parsed.data : undefined,
      };
    }
  }
}
