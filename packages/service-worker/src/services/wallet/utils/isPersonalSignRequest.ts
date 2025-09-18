import { RpcMethod } from '@avalabs/vm-module-types';
import { MessageSigningData } from '@core/types';

export const isPersonalSign = (
  message: MessageSigningData,
): message is Extract<
  MessageSigningData,
  { type: RpcMethod.PERSONAL_SIGN | RpcMethod.ETH_SIGN }
> =>
  message.type === RpcMethod.PERSONAL_SIGN ||
  message.type === RpcMethod.ETH_SIGN;
