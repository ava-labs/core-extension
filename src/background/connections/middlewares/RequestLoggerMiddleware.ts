import { requestLog, responseLog } from '@src/utils/logging';
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

export function LoggerMiddleware(sideToLog: SideToLog): Middleware {
  return (context, next) => {
    if (!SUPER_NOISY_REQUESTS.includes(context.request.data.method)) {
      if (sideToLog === SideToLog.REQUEST) {
        requestLog(
          `Web3 request (${context.request.data.method})`,
          context.request.data
        );
      } else if (sideToLog === SideToLog.RESPONSE) {
        responseLog(
          `Web3 response (${context.request.data.method})`,
          context.response
        );
      }
    }

    next();
  };
}
