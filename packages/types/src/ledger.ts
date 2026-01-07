export interface LedgerDeviceResponseData {
  requestId: string;
  method: string;
  error?: any;
  result?: any;
}

export interface LedgerDeviceRequestData {
  requestId: string;
  method: string;
  connectionUUID: string;
  params: any;
}

export enum LedgerEvent {
  TRANSPORT_REQUEST = 'LedgerEvent:transport_request',
  DISCOVER_TRANSPORTS = 'LedgerEvent:discover_transports',
  TRANSPORT_CLOSE_REQUEST = 'LedgerEvent:transport_close',
}

export type DerivationStatus =
  | 'waiting'
  | 'ready'
  | 'error'
  | 'needs-user-gesture';

export const LEDGER_VERSION_WARNING_WAS_CLOSED =
  'LEDGER_VERSION_WARNING_WAS_CLOSED';

/**
 * Ledger app will throw an error if the tx to sign is too large.
 * Approximately `8kb` is the current limit.
 */
export const LEDGER_TX_SIZE_LIMIT_BYTES = 8192;
