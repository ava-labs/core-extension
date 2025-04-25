import { ChainAddressChainIdMapListResponse } from '@avalabs/glacier-sdk';
import { IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';

export type GetTotalBalanceForWalletParams = {
  walletId: string;
};

export type AddressActivityFetcher = (
  addresses: string[],
) => Promise<ChainAddressChainIdMapListResponse>;

export const ITERATION_LIMIT = 10; // Abitrary number to avoid an infinite loop.
export const ADDRESS_GAP_LIMIT = 20;
export const GLACIER_ADDRESS_FETCH_LIMIT = 64; // Requested addresses are encoded as query params, and Glacier enforces URI length limits

export const isImportedAccountsRequest = (walletId: string) =>
  walletId === IMPORTED_ACCOUNTS_WALLET_ID;
