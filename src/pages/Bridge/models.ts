import { Big } from '@avalabs/avalanche-wallet-sdk';
import { ERC20Asset, NativeAsset } from '@avalabs/bridge-sdk';

export interface ExtendedERC20Asset extends ERC20Asset {
  tokenName?: string;
}

export interface ExtendedNativeAsset extends NativeAsset {
  tokenName?: string;
}

export type Asset = ExtendedERC20Asset | ExtendedNativeAsset;
export interface AssetBalance {
  symbol: string;
  asset: Asset;
  balance: Big | undefined;
}
