import { NetworkContractToken, NetworkToken } from '@avalabs/chains-sdk';
import { BitcoinInputUTXO } from '@avalabs/wallets-sdk';
import BN from 'bn.js';

export enum BalanceServiceEvents {
  UPDATED = 'BalanceServiceEvents:updated',
}

interface TokenBalanceData {
  type: TokenType;
  balance: BN;
  balanceUSD?: number;
  balanceDisplayValue?: string;
  balanceUsdDisplayValue?: string;
  priceUSD?: number;
  utxos?: BitcoinInputUTXO[];
}

export enum TokenType {
  NATIVE = 'NATIVE',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export interface TokenWithBalanceERC20
  extends TokenBalanceData,
    NetworkContractToken {
  type: TokenType.ERC20;
}

export interface NftTokenWithBalance extends TokenBalanceData {
  type: TokenType.ERC721 | TokenType.ERC1155;
  address: string;
  decimals: number;
  description: string;
  logoUri: string;
  name: string;
  symbol: string;
  tokenId: string;
}

export interface NetworkTokenWithBalance
  extends TokenBalanceData,
    NetworkToken {
  type: TokenType.NATIVE;
}

export type TokenWithBalance =
  | NetworkTokenWithBalance
  | TokenWithBalanceERC20
  | NftTokenWithBalance;

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
export interface Balances {
  [networkId: string | number]:
    | { [address: string]: TokenWithBalance[] }
    | undefined;
}
