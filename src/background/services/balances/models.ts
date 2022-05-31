import { NetworkContractToken, NetworkToken } from '@avalabs/chains-sdk';
import { BitcoinInputUTXO } from '@avalabs/wallets-sdk';
import BN from 'bn.js';

export enum BalanceServiceEvents {
  UPDATED = 'BalanceServiceEvents:updated',
}

interface TokenBalanceData {
  isNetworkToken: boolean;
  isERC20: boolean;
  balance: BN;
  balanceUSD?: number;
  balanceDisplayValue?: string;
  balanceUsdDisplayValue?: string;
  priceUSD?: number;
  utxos?: BitcoinInputUTXO[];
}

export interface NetworkContractTokenWithBalance
  extends TokenBalanceData,
    NetworkContractToken {
  isERC20: true;
  isNetworkToken: false;
}

export interface NetworkTokenWithBalance
  extends TokenBalanceData,
    NetworkToken {
  isERC20: false;
  isNetworkToken: true;
}

export type TokenWithBalance =
  | NetworkTokenWithBalance
  | NetworkContractTokenWithBalance;

export interface TokenListDict {
  [contract: string]: TokenWithBalance;
}

export interface TokenListERC20 {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

// store balances in the structure of network ID -> address -> tokens
export type Balances = Record<
  number,
  Record<string, TokenWithBalance[]> | undefined
>;

export type SerializedBalances = Record<
  number,
  Record<string, Omit<TokenWithBalance, 'balances'> & { balance: string }>
>;
