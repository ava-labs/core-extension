export enum MessageType {
  SIGN_TYPED_DATA_V3 = 'eth_signTypedData_v3',
  SIGN_TYPED_DATA_V4 = 'eth_signTypedData_v4',
  SIGN_TYPED_DATA_V1 = 'eth_signTypedData_v1',
  SIGN_TYPED_DATA = 'eth_signTypedData',
  PERSONAL_SIGN = 'personal_sign',
  ETH_SIGN = 'eth_sign',
}

export interface MessageDisplayData {
  data?: any;
  from?: any;
  password?: any;
}

export type MessageParams = {
  data: any;
  from: string;
  password?: string;
};
