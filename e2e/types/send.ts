/**
 * Send test data shape used by TEST_SEND constants.
 *
 * Only `tokenSymbol` and `amount` are required — every other field is optional
 * because different send flows use different subsets (e.g. ERC-20 needs
 * `feeSymbol` and `chainFilterChip`; contact sends need `recipientContactName`).
 */
export interface SendTransactionData {
  tokenSymbol: string;
  amount: string;

  /** Search term typed into the token-select popover (defaults to tokenSymbol). */
  tokenSearchTerm?: string;
  /** Alt text on the chain badge icon used to disambiguate tokens across chains. */
  chainBadgeAltText?: string;
  /** Regex or string to match the chain-filter chip button in the token popover. */
  chainFilterChip?: string | RegExp;
  /** Network name shown on the approval screen. */
  networkLabel?: string;
  /** Symbol of the fee token (e.g. 'AVAX', 'ETH') when it differs from tokenSymbol. */
  feeSymbol?: string;

  /** Internal account name (e.g. "Account 2") to select as recipient. */
  recipientAccount?: string;
  /** Address-book contact display name. */
  recipientContactName?: string;
  /** EVM address of the saved contact (snapshot-dependent). */
  recipientContactEvmAddress?: string;
  /** Solana address of the saved contact (snapshot-dependent). */
  recipientContactSolAddress?: string;
  /** An EVM address intentionally not in the address book, for "Unknown" label tests. */
  randomUnsavedEvmAddress?: string;
}
