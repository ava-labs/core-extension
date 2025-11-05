import { ChainAddressChainIdMapListResponse } from '@avalabs/glacier-sdk';
import { IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';

export type GetTotalBalanceForWalletParams = {
  walletId: string;
};

export type AddressActivityFetcher = (
  addresses: string[],
) => Promise<ChainAddressChainIdMapListResponse>;

export const ITERATION_LIMIT = 10; // Abitrary number to avoid an infinite loop.
export const ADDRESS_GAP_LIMIT = 20; // Stop searching after 20 consecutive addresses with no activity
export const GLACIER_ADDRESS_FETCH_LIMIT = 64; // Request to Glacier in batches of 64 addresses
export const INTERNAL_ADDRESS_BATCH_SIZE = 100; // Batch 100 internal addresses
export const EXTERNAL_ADDRESS_BATCH_SIZE = 100; // Batch 100 external addresses

export const isImportedAccountsRequest = (walletId: string) =>
  walletId === IMPORTED_ACCOUNTS_WALLET_ID;
