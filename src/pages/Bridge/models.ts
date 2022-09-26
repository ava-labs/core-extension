import { Asset, Blockchain } from '@avalabs/bridge-sdk';
import Big from 'big.js';

export interface AssetBalance {
  symbol: string;
  asset: Asset;
  balance: Big | undefined;
  symbolOnNetwork?: string;
  logoUri?: string;
  price?: number;
}

export const blockchainDisplayNameMap = new Map([
  [Blockchain.AVALANCHE, 'Avalanche C-Chain'],
  [Blockchain.ETHEREUM, 'Ethereum'],
  [Blockchain.BITCOIN, 'Bitcoin'],
  [Blockchain.UNKNOWN, ''],
]);

export const SUPPORTED_CHAINS = [
  Blockchain.AVALANCHE,
  Blockchain.ETHEREUM,
  Blockchain.BITCOIN,
];
