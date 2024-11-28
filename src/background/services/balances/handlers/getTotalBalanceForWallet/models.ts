import { ChainAddressChainIdMapListResponse } from '@avalabs/glacier-sdk';

export type GetTotalBalanceForWalletParams = {
  walletId: string;
};

export type TotalBalanceForWallet = {
  totalBalanceInCurrency?: number;
  hasBalanceOnUnderivedAccounts: boolean;
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
export const IMPORTED_ACCOUNTS_WALLET_ID = '__IMPORTED__';
export const isImportedAccountsRequest = (walletId: string) =>
  walletId === IMPORTED_ACCOUNTS_WALLET_ID;
