export interface AnalyticsState {
  deviceId: string;
  userId: string;
  addressId?: string;
}

export enum AnalyticsEvents {
  ANALYTICS_STATE_UPDATED = 'AnalyticsEvents: ANALYTICS_STATE_UPDATED',
}

export const ANALYTICS_STORAGE_KEY = 'ANALYTICS_STORAGE_KEY';
