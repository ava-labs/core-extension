import { BitcoinInputUTXO } from '@avalabs/wallets-sdk';
import BN from 'bn.js';

export enum BalanceServiceEvents {
  updated = 'BalanceServiceEvents:updated',
}

/**
 * The goal here is to normalize the data between Ant, Avax and ERC20. All display values should be
 * normalized as well and we provide a few type guards to filter and type back tot he expected type
 * for the respected entity.
 */
export interface TokenWithBalance {
  name: string;
  symbol: string;
  address?: string;
  logoURI?: string;
  isErc20?: boolean;
  isAvax?: boolean;
  isAnt?: boolean;
  balance: BN;
  balanceUSD?: number;
  balanceDisplayValue?: string;
  balanceUsdDisplayValue?: string;
  priceUSD?: number;
  color?: string;
  denomination?: number;
  decimals?: number;
  utxos?: BitcoinInputUTXO[];
}

export interface TokenListDict {
  [contract: string]: TokenListERC20;
}

export interface TokenListERC20 {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}
