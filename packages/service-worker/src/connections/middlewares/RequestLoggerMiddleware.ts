import { requestLog, responseLog } from '@core/common';
import {
  JsonRpcRequest,
  JsonRpcResponse,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '@core/types';
import { Middleware } from './models';

/**
 * dApps call these function over and over
 */
export const SUPER_NOISY_REQUESTS = [
  'eth_chainId',
  'eth_blockNumber',
  'eth_call',
];

export enum SideToLog {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
}

export function LoggerMiddleware(
  sideToLog: SideToLog,
): Middleware<
  ExtensionConnectionMessage | JsonRpcRequest,
  ExtensionConnectionMessageResponse<any, any> | JsonRpcResponse
> {
  return (context, next) => {
    if (!SUPER_NOISY_REQUESTS.includes(context.request.params.request.method)) {
      if (sideToLog === SideToLog.REQUEST) {
        requestLog(
          `Web3 request (${context.request.params.request.method})`,
          context.request,
        );
      } else if (sideToLog === SideToLog.RESPONSE) {
        responseLog(
          `Web3 response (${context.request.params.request.method})`,
          context.response,
        );
      }
    }

    next();
  };
}
