export type DerivationStatus =
  | 'waiting'
  | 'ready'
  | 'error'
  | 'needs-user-gesture';

export const LEDGER_MULTIPLE_DEVICES_ERROR =
  'Multiple Ledger devices are connected';

export const LEDGER_DEVICE_LOCKED_ERROR = 'Ledger device is locked';

export const LEDGER_VERSION_WARNING_WAS_CLOSED =
  'LEDGER_VERSION_WARNING_WAS_CLOSED';

/**
 * Ledger app will throw an error if the tx to sign is too large.
 * Approximately `8kb` is the current limit.
 */
export const LEDGER_TX_SIZE_LIMIT_BYTES = 8192;
