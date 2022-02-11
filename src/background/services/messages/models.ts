import { DomainMetadata } from '@src/background/models';
import { JsonRpcRequest } from 'json-rpc-engine';
import { TxStatus } from '../transactions/models';

export enum MessageType {
  SIGN_TYPED_DATA_V3 = 'eth_signTypedData_v3',
  SIGN_TYPED_DATA_V4 = 'eth_signTypedData_v4',
  SIGN_TYPED_DATA_V1 = 'eth_signTypedData_v1',
  SIGN_TYPED_DATA = 'eth_signTypedData',
  PERSONAL_SIGN = 'personal_sign',
  ETH_SIGN = 'eth_sign',
}

export interface Message extends JsonRpcRequest<any> {
  time: number;
  status: TxStatus;
  result?: any;
  error?: string;
  displayData: {
    data?: any;
    from?: any;
    password?: any;
  };
  site: DomainMetadata;
}

export interface SignedMessageResult {
  status: string;
  id?: string;
  result: string;
}

export interface MessageUpdate {
  id: any;
  status: TxStatus;
  result?: string;
  error?: string;
}
