import { isEthAsset } from '@avalabs/core-bridge-sdk';
import { AssetBalance } from '../models';
import { isUnifiedBridgeAsset } from './isUnifiedBridgeAsset';

export const getTokenAddress = (token: AssetBalance): string => {
  if (isUnifiedBridgeAsset(token.asset)) {
    return token.asset.address ?? '';
  } else if (isEthAsset(token.asset)) {
    return token.asset.nativeContractAddress;
  }
  return '';
};
