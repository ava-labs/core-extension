import BN from 'bn.js';
import { SendableToken } from '../balances/models';
import { SignTransactionRequest } from '../wallet/models';

export enum SendEvent {
  TX_DETAILS = 'SendEvent: TX_DETAILS',
}

export interface SendError {
  error: boolean;
  message: string;
}

export const DEFAULT_SEND_HOOK_ERROR: SendError = {
  error: false,
  message: '',
};

export interface SendState<T extends SendableToken = SendableToken> {
  maxAmount?: BN;
  amount?: BN;
  address?: string;
  error?: SendError;
  sendFee?: BN;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  gasLimit?: number;
  customGasLimit?: number;
  canSubmit?: boolean;
  loading?: boolean;
  isValidating?: boolean;
  token?: T;
  txId?: string;
}

export type ValidSendState = SendState &
  Required<Pick<SendState, 'amount' | 'address' | 'maxFeePerGas'>> & {
    canSubmit: true;
  };

export function isValidSendState(
  sendState: SendState
): sendState is ValidSendState {
  return sendState.canSubmit === true;
}

export interface SendErrors {
  amountError: SendError;
  addressError: SendError;
  formError: SendError;
}

// see getSendErrorMessage for the message for display
export enum SendErrorMessage {
  AMOUNT_REQUIRED = 'AMOUNT_REQUIRED',
  ADDRESS_REQUIRED = 'ADDRESS_REQUIRED',
  C_CHAIN_REQUIRED = 'C_CHAIN_REQUIRED',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_NETWORK_FEE = 'INVALID_NETWORK_FEE',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_BALANCE_FOR_FEE = 'INSUFFICIENT_BALANCE_FOR_FEE',
}

export interface SendServiceHelper {
  getTransactionRequest(sendState: SendState): Promise<SignTransactionRequest>;
  validateStateAndCalculateFees(sendState: SendState): Promise<SendState>;
}
