import { DAppProviderRequest } from './dapp-connection';

export enum MessageType {
  SIGN_TYPED_DATA_V1 = DAppProviderRequest.ETH_SIGN_TYPED_DATA_V1,
  SIGN_TYPED_DATA_V3 = DAppProviderRequest.ETH_SIGN_TYPED_DATA_V3,
  SIGN_TYPED_DATA_V4 = DAppProviderRequest.ETH_SIGN_TYPED_DATA_V4,
  SIGN_TYPED_DATA = DAppProviderRequest.ETH_SIGN_TYPED_DATA,
  PERSONAL_SIGN = DAppProviderRequest.PERSONAL_SIGN,
  ETH_SIGN = DAppProviderRequest.ETH_SIGN,
  AVALANCHE_SIGN = DAppProviderRequest.AVALANCHE_SIGN_MESSAGE,
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
  accountIndex?: number;
};

export type SignMessageData = {
  messageParams: MessageParams;
  isMessageValid: boolean;
  validationError?: string;
};
