import { JsonRpcRequest } from '@src/utils/jsonRpcEngine';
import { MessageType } from '../models';

export function paramsToMessageParams(data: JsonRpcRequest<any>) {
  const { params, method } = data;
  switch (method) {
    case MessageType.PERSONAL_SIGN:
      return {
        data: params[0],
        from: params[1],
        password: params[2],
      };
    case MessageType.SIGN_TYPED_DATA:
      return {
        data: params[0],
        from: params[1],
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
