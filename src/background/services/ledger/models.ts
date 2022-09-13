export interface DeviceResponseData {
  requestId: string;
  method: string;
  error?: any;
  result?: any;
}

export interface DeviceRequestData {
  requestId: string;
  method: string;
  params: any;
}

export enum LedgerEvent {
  TRANSPORT_REQUEST = 'LedgerEvent:transport_request',
  DISCOVER_TRANSPORTS = 'LedgerEvent:discover_transports',
}