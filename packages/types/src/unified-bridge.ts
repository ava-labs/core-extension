import type {
  BridgeAsset,
  BridgeStepDetails,
  BridgeTransfer,
  ChainAssetMap,
} from '@avalabs/bridge-unified';
import { FeatureGates } from './feature-flags';

export type UnifiedBridgeState = {
  pendingTransfers: Record<string, BridgeTransfer>;
};

export const UNIFIED_BRIDGE_TRACKED_FLAGS = [
  FeatureGates.UNIFIED_BRIDGE_CCTP,
  FeatureGates.UNIFIED_BRIDGE_ICTT,
  FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC,
  FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA,
  FeatureGates.UNIFIED_BRIDGE_AB_EVM,
  FeatureGates.UNIFIED_BRIDGE_LOMBARD_BTC_TO_AVA,
  FeatureGates.UNIFIED_BRIDGE_LOMBARD_AVA_TO_BTC,
];

export const UNIFIED_BRIDGE_DEFAULT_STATE: UnifiedBridgeState = {
  pendingTransfers: {},
};

export const UNIFIED_BRIDGE_STATE_STORAGE_KEY = 'UNIFIED_BRIDGE_STATE';

export enum UnifiedBridgeEvent {
  StateUpdated = 'UNIFIED_BRIDGE_STATE_UPDATED',
  TransferStepChange = 'UNIFIED_BRIDGE_TRASNFER_STEP_CHANGE',
  AssetsUpdated = 'UNIFIED_BRIDGE_ASSETS_UPDATED',
}

export type UnifiedBridgeStateUpdateEvent = {
  name: UnifiedBridgeEvent.StateUpdated;
  value: UnifiedBridgeState;
};

export type UnifiedBridgeTransferStepChangeEvent = {
  name: UnifiedBridgeEvent.TransferStepChange;
  value: BridgeStepDetails;
};

export type UnifiedBridgeAssetsUpdated = {
  name: UnifiedBridgeEvent.AssetsUpdated;
  value: ChainAssetMap;
};

export type UnifiedBridgeTransferParams = {
  asset: BridgeAsset;
  amount: bigint;
  targetChainId: number;
  sourceChainId: number;
  tabId?: number;
};

export type UnifiedBridgeEstimateGasParams = Pick<
  UnifiedBridgeTransferParams,
  'amount' | 'asset' | 'targetChainId' | 'sourceChainId'
>;
