import { RpcMethod } from '@avalabs/vm-module-types';
import { MessageSigningMethod, MessageType } from '@core/types';

export const rpcMethodToMessageType = (
  rpcMethod: MessageSigningMethod,
): MessageType => {
  switch (rpcMethod) {
    case RpcMethod.ETH_SIGN:
      return MessageType.ETH_SIGN;

    case RpcMethod.PERSONAL_SIGN:
      return MessageType.PERSONAL_SIGN;

    case RpcMethod.SIGN_TYPED_DATA:
      return MessageType.SIGN_TYPED_DATA;

    case RpcMethod.SIGN_TYPED_DATA_V1:
      return MessageType.SIGN_TYPED_DATA_V1;

    case RpcMethod.SIGN_TYPED_DATA_V3:
      return MessageType.SIGN_TYPED_DATA_V3;

    case RpcMethod.SIGN_TYPED_DATA_V4:
      return MessageType.SIGN_TYPED_DATA_V4;

    case RpcMethod.AVALANCHE_SIGN_MESSAGE:
      return MessageType.AVALANCHE_SIGN;

    default:
      throw new Error(`Unknown RPC method: ${rpcMethod}`);
  }
};
