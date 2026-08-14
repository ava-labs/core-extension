import {
  ExtensionConnectionEvent,
  TransactionStatusEvents,
  TransactionStatusInfo,
} from '@core/types';

type AnalyticsEventBuilderFn = (
  event: ExtensionConnectionEvent<TransactionStatusInfo>,
) => Promise<{ name: string; properties: Record<string, unknown> } | null>;

export type TransactionStatusEventBuilders = Partial<
  Record<TransactionStatusEvents, AnalyticsEventBuilderFn>
>;
