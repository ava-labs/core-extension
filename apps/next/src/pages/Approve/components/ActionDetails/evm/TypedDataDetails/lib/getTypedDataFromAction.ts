import {
  MessageTypes,
  RpcMethod,
  TypedData,
  TypedDataV1,
} from '@avalabs/vm-module-types';

import { Action } from '@core/types';

const TYPED_DATA_METHODS: RpcMethod[] = [
  RpcMethod.SIGN_TYPED_DATA,
  RpcMethod.SIGN_TYPED_DATA_V1,
  RpcMethod.SIGN_TYPED_DATA_V3,
  RpcMethod.SIGN_TYPED_DATA_V4,
];

/**
 * Narrows an action to the EIP-712 typed data it carries, when it is a
 * `eth_signTypedData*` request. Returns null for every other action so
 * callers can fall back to the default rendering.
 */
export const getTypedDataFromAction = (
  action: Action,
): TypedData<MessageTypes> | TypedDataV1 | null => {
  const signingData = action.signingData;

  if (
    !signingData ||
    !TYPED_DATA_METHODS.includes(signingData.type) ||
    !('data' in signingData)
  ) {
    return null;
  }

  const data = signingData.data;
  if (data === null || typeof data !== 'object') {
    return null;
  }

  return data as TypedData<MessageTypes> | TypedDataV1;
};
