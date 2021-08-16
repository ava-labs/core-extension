import { JsonRpcRequest } from '@src/background/rpc/jsonRpcEngine';
import { MessageType } from '../models';

export function paramsToMessageParams(
  data: JsonRpcRequest<any>,
  signType: MessageType
) {
  const { params } = data;
  switch (signType) {
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
        data: params[0],
        from: params[1],
      };
    default:
      return {
        from: params[0],
        data: params[1],
      };
  }
}
