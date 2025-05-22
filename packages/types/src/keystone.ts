export interface KeystoneSendState {
  txId: string;
  signature: string;
}

export type CBOR = {
  cbor: string;
  type: string;
};

export type KeystoneDeviceRequestData = CBOR & {
  requestId: string;
  tabId?: number;
};

export type KeystoneDeviceResponseData = CBOR & {
  requestId: string;
};

export enum KeystoneEvent {
  DEVICE_REQUEST = 'KeystoneEvent:device_request',
}

export interface KeystoneTransport {
  requestSignature(cbor: CBOR, tabId?: number): Promise<Buffer>;
}
