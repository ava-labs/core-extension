import { Asset } from '@avalabs/bridge-sdk';
import Big from 'big.js';

export const BALANCE_REFRESH_INTERVAL = 1000 * 60;

export interface AssetBalance {
  symbol: string;
  asset: Asset;
  balance: Big | undefined;
  symbolOnNetwork?: string;
}
