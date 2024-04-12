import { NetworkContractToken, NetworkToken } from '@avalabs/chains-sdk';
import { BitcoinInputUTXOWithOptionalScript } from '@avalabs/wallets-sdk';
import BN from 'bn.js';

export const BALANCES_CACHE_KEY = 'balances-service-cache';

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
  utxos?: BitcoinInputUTXOWithOptionalScript[];
  utxosUnconfirmed?: BitcoinInputUTXOWithOptionalScript[];
  unconfirmedBalance?: BN;
  unconfirmedBalanceDisplayValue?: string;
  unconfirmedBalanceUsdDisplayValue?: string;
  unconfirmedBalanceUSD?: number;
  priceChanges?: {
    percentage?: number;
    value?: number;
  };
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

export type RawTokenAttribute = {
  value: string;
} & (
  | {
      name: string;
      trait_type: never;
    }
  | {
      name: never;
      trait_type: string;
    }
);

export interface NftMetadata {
  attributes?: string;
  name?: string;
  image?: string;
  description?: string;
}

export interface TokenAttribute {
  name: string;
  value: string;
}
export interface NftTokenWithBalance extends TokenBalanceData {
  type: TokenType.ERC721 | TokenType.ERC1155;
  address: string;
  description: string;
  logoUri: string;
  logoSmall: string;
  name: string;
  symbol: string;
  tokenId: string;
  attributes: TokenAttribute[];
  collectionName: string;
  updatedAt?: number;
}

export interface NftPageTokens {
  [TokenType.ERC721]?: string;
  [TokenType.ERC1155]?: string;
}

export interface NftBalanceResponse {
  list: NftTokenWithBalance[];
  pageTokens?: NftPageTokens;
}

export interface NetworkTokenWithBalance
  extends TokenBalanceData,
    NetworkToken {
  type: TokenType.NATIVE;
}

export type TokenWithBalance = NetworkTokenWithBalance | TokenWithBalanceERC20;
export type SendableToken = TokenWithBalance | NftTokenWithBalance;

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
    | {
        [accountAddress: string]: {
          [tokenAddressOrSymbol: string]: TokenWithBalance;
        };
      }
    | undefined;
}

export const CLOUDFLARE_IPFS_URL = 'https://cloudflare-ipfs.com';

export interface CachedBalancesInfo {
  totalBalance?: TotalBalance;
  balances?: Balances;
  lastUpdated?: number;
}

export type TotalBalance = {
  [address: string | number]: {
    sum: number | null;
    priceChange: TotalPriceChange;
  };
};

export interface TotalPriceChange {
  value: number;
  percentage: number[];
}
