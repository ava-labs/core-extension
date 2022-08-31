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
