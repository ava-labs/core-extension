export interface AnalyticsState {
  deviceId: string;
  userId: string;
  addressId?: string;
}

export interface AnalyticsSessionState {
  sessionId: string;
}

export interface AnalyticsUnencryptedState {
  deviceId?: string;
}

export interface AnalyticsCapturedEvent {
  name: string;
  windowId: string;
  properties?: Record<string, any>;
}

export interface UserEnvironmentAnalytics {
  $os: string;
  $browser: string;
  $browser_version: string;
}

export enum AnalyticsEvents {
  ANALYTICS_STATE_UPDATED = 'AnalyticsEvents: ANALYTICS_STATE_UPDATED',
}

export const ANALYTICS_STORAGE_KEY = 'ANALYTICS_STORAGE_KEY';
export const ANALYTICS_UNENCRYPTED_STORAGE_KEY =
  'ANALYTICS_UNENCRYPTED_STORAGE_KEY';

export const ANALYTICS_SESSION_KEY = 'ANALYTICS_SESSION_KEY';

//Based on CAIP-2
export enum BlockchainId {
  P_CHAIN = 'avax:11111111111111111111111111111111LpoYY',
  P_CHAIN_TESTNET = 'avax:fuji-11111111111111111111111111111111LpoYY',
  X_CHAIN = 'avax:2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM',
  X_CHAIN_TESTNET = 'avax:2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm',
}

export enum TimeMeasureEventNames {
  TRANSACTION_TIMED = 'transaction-timed',
  TRANSACTION_SUCCEEDED = 'transaction-succeeded',
  TRANSACTION_APPROVED = 'transaction-approved',
}
