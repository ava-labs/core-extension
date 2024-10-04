import { BridgeAsset } from '@avalabs/bridge-unified';
import Big from 'big.js';

export interface AssetBalance {
  symbol: string;
  asset: BridgeAsset;
  balance: Big | undefined;
  symbolOnNetwork?: string;
  logoUri?: string;
  price?: number;
  unconfirmedBalance?: Big;
}
