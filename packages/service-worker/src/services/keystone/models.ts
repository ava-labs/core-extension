export interface KeystoneSendState {
  txId: string;
  signature: string;
}

export type CBOR = {
  cbor: string;
  type: string;
};

export type DeviceRequestData = CBOR & {
  requestId: string;
  tabId?: number;
};

export type DeviceResponseData = CBOR & {
  requestId: string;
};

export enum KeystoneEvent {
  DEVICE_REQUEST = 'KeystoneEvent:device_request',
}

export interface KeystoneTransport {
  requestSignature(cbor: CBOR, tabId?: number): Promise<Buffer>;
}
