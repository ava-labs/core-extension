import { ChainAddressChainIdMapListResponse } from '@avalabs/glacier-sdk';

export type GetWalletsWithActivityParams = {
  walletId: string;
};

export type TotalBalanceForWallet = {
  totalBalanceInCurrency?: number;
  hasBalanceOnUnderivedAccounts: boolean;
  hasBalanceOfUnknownFiatValue: boolean;
};
export type SearchSpace = 'i' | 'e';
export type XPAddress = string;
export type XPAddressData = { index: number; space: SearchSpace };
export type XPAddressDictionary = Record<XPAddress, XPAddressData>;

export type AddressActivityFetcher = (
  addresses: string[]
) => Promise<ChainAddressChainIdMapListResponse>;

export const ADDRESS_GAP_LIMIT = 20;
export const GLACIER_ADDRESS_FETCH_LIMIT = 64; // Requested addresses are encoded as query params, and Glacier enforces URI length limits
export const ITERATION_LIMIT = 10; // Abitrary number to avoid an infinite loop.
