import { BridgeAsset } from '@avalabs/bridge-unified';

export const isUnifiedBridgeAsset = (asset: unknown): asset is BridgeAsset => {
  return asset !== null && typeof asset === 'object' && 'destinations' in asset;
};
