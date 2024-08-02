import { NetworkContractToken, NetworkToken } from '@avalabs/core-chains-sdk';
import {
  PChainBalance as GlacierPchainBalance,
  XChainBalances as GlacierXchainBalance,
} from '@avalabs/glacier-sdk';
import { BitcoinInputUTXOWithOptionalScript } from '@avalabs/core-wallets-sdk';
import { EnsureDefined } from '@src/background/models';
import BN from 'bn.js';

export const BALANCES_CACHE_KEY = 'balances-service-cache';

export enum BalanceServiceEvents {
  UPDATED = 'BalanceServiceEvents:updated',
}

interface TokenBalanceData {
  type: TokenType;
  name: string;
  symbol: string;
  balance: BN;
  balanceUSD?: number;
  balanceDisplayValue?: string;
  balanceUsdDisplayValue?: string;
  priceUSD?: number;
  priceChanges?: {
    percentage?: number;
    value?: number;
  };
}

interface TokenBalanceDataWithDecimals extends TokenBalanceData {
  decimals: number;
}

export enum TokenType {
  NATIVE = 'NATIVE',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export interface TokenWithBalanceBTC extends NetworkTokenWithBalance {
  logoUri: string;
  utxos: BitcoinInputUTXOWithOptionalScript[];
  utxosUnconfirmed?: BitcoinInputUTXOWithOptionalScript[];
  unconfirmedBalance?: BN;
  unconfirmedBalanceDisplayValue?: string;
  unconfirmedBalanceUsdDisplayValue?: string;
  unconfirmedBalanceUSD?: number;
}

export interface TokenWithBalancePVM extends NetworkTokenWithBalance {
  available?: BN;
  availableUSD?: number;
  availableDisplayValue?: string;
  availableUsdDisplayValue?: string;
  utxos?: GlacierPchainBalance;
  lockedStaked: number;
  lockedStakeable: number;
  lockedPlatform: number;
  atomicMemoryLocked: number;
  atomicMemoryUnlocked: number;
  unlockedUnstaked: number;
  unlockedStaked: number;
  pendingStaked: number;
}

export interface TokenWithBalanceAVM extends NetworkTokenWithBalance {
  available?: BN;
  availableUSD?: number;
  availableDisplayValue?: string;
  availableUsdDisplayValue?: string;
  utxos?: GlacierXchainBalance;
  locked: number;
  unlocked: number;
  atomicMemoryUnlocked: number;
  atomicMemoryLocked: number;
}

export interface TokenWithBalanceERC20
  extends TokenBalanceDataWithDecimals,
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
  extends NetworkToken,
    TokenBalanceDataWithDecimals {
  type: TokenType.NATIVE;
}

export type TokenWithBalanceEVM =
  | NetworkTokenWithBalance
  | TokenWithBalanceERC20;

export type TokenWithBalance =
  | TokenWithBalanceEVM
  | TokenWithBalanceBTC
  | TokenWithBalancePVM
  | TokenWithBalanceAVM;

export type SendableToken = TokenWithBalance | NftTokenWithBalance;

export interface TokenListDict {
  [contract: string]: TokenWithBalance;
}

export interface TokenListERC20 {
  address: string;
  chainId: number;
}

// store balances in the structure of network ID -> address -> tokens
export interface Balances {
  [networkId: string | number]: {
    [accountAddress: string]: {
      [tokenAddressOrSymbol: string]: TokenWithBalance;
    };
  };
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

export class GlacierUnhealthyError extends Error {
  message = 'Glacier is unhealthy. Try again later.';
}

export const hasUnconfirmedBTCBalance = (
  token?: TokenWithBalance
): token is EnsureDefined<TokenWithBalanceBTC, 'unconfirmedBalance'> =>
  Boolean(token && 'unconfirmedBalance' in token);

export const isAvaxWithUnavailableBalance = (
  token?: TokenWithBalance
): token is EnsureDefined<
  TokenWithBalanceAVM | TokenWithBalancePVM,
  'available'
> =>
  Boolean(
    token &&
      ('locked' in token || 'unlockedUnstaked' in token) &&
      token.available?.toNumber() !== token.balance?.toNumber()
  );
