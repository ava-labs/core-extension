import { JsonRpcRequestPayload } from '@src/background/connections/dAppConnection/models';
import { MessageParams, MessageType } from '../models';

export function paramsToMessageParams(
  data: JsonRpcRequestPayload<MessageType, any[]>,
): MessageParams {
  const { params, method } = data;
  switch (method) {
    case MessageType.PERSONAL_SIGN:
      return {
        data: params[0],
        from: params[1],
        password: params[2],
      };
    case MessageType.SIGN_TYPED_DATA:
    case MessageType.SIGN_TYPED_DATA_V1:
      // Ethereum document says a string for 'from' value should be 0th index. (An array in 1st index) But MetaMask expects a string to be in 1st index.
      // In order to handle both cases, we are checking which one is a string and which one is an array and assign the value properly.

      return {
        data: params.find((param) => Array.isArray(param)),
        from: params.find(
          (param: any) => typeof param === 'string' || param instanceof String,
        ),
      };
    case MessageType.ETH_SIGN:
      return {
        data: params[1],
        from: params[0],
      };
    case MessageType.SIGN_TYPED_DATA_V3:
    case MessageType.SIGN_TYPED_DATA_V4:
      return {
        data: JSON.parse(params[1]),
        from: params[0],
      };
    default:
      return {
        data: params[1],
        from: params[0],
      };
  }
}
