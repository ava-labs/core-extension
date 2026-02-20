import { FeatureGates, TrackedTransfers } from '@core/types';

export type TransferTrackingState = {
  trackedTransfers: TrackedTransfers;
};

export type TransferTrackingServiceEvents = 'tracked-transfers-updated';

export const UNIFIED_TRANSFER_TRACKED_FLAGS = [
  FeatureGates.FUSION_MARKR,
  FeatureGates.FUSION_AVALANCHE_EVM,
  FeatureGates.FUSION_LOMBARD_AVA_TO_BTC,
  FeatureGates.FUSION_LOMBARD_BTC_TO_AVA,
];

export const TRANSFER_TRACKING_DEFAULT_STATE: TransferTrackingState = {
  trackedTransfers: {},
};

export const TRANSFER_TRACKING_STATE_STORAGE_KEY = 'TRANSFER_TRACKING_STATE';
