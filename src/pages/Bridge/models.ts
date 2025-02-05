import type {
  BridgeAsset,
  BridgeType,
  GasSettings,
} from '@avalabs/bridge-unified';
import type Big from 'big.js';

export interface AssetBalance {
  symbol: string;
  asset: BridgeAsset;
  balance: Big | undefined;
  symbolOnNetwork?: string;
  logoUri?: string;
  price?: number;
  unconfirmedBalance?: Big;
}

export type BridgeOptions = {
  bridgeType?: BridgeType;
  gasSettings?: GasSettings;
};
