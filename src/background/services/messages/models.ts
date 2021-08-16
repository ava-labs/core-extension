export enum MessageType {
  SIGN_TYPED_DATA_V3 = 'signTypedData_v3',
  SIGN_TYPED_DATA_V4 = 'signTypedData_v4',
  SIGN_TYPED_DATA_V1 = 'signTypedData_v1',
  SIGN_TYPED_DATA = 'signTypedData',
  PERSONAL_SIGN = 'personal_sign',
  ETH_SIGN = 'eth_sign',
}

export interface Message {
  id: number | string | void;
  msgParams: { from: string; data: any; password?: string };
  time: number;
  status: string;
  type: MessageType;
  result?: string;
}

export interface SignedMessageResult {
  status: string;
  id?: string;
  result: string;
}
