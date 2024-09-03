import { AnalyticsServicePosthog } from '@src/background/services/analytics/AnalyticsServicePosthog';

import {
  JsonRpcFailure,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcSuccess,
} from '../dAppConnection/models';

import { Context, Middleware } from './models';
import { RpcMethod } from '@avalabs/vm-module-types';
import { measureDuration } from '@src/utils/measureDuration';

const REQUESTS_TO_WATCH = [RpcMethod.BITCOIN_SEND_TRANSACTION];
const requestsMetadata = new Map<
  string,
  { txType: string; chainId: number; site: string; rpcUrl: string }
>();

const buildMetadata = (
  context: Context<JsonRpcRequest, JsonRpcSuccess<unknown> | JsonRpcFailure>
) => {
  if (!context.network || !context.domainMetadata) {
    return null;
  }

  const { method } = context.request.params.request;

  if (method === RpcMethod.BITCOIN_SEND_TRANSACTION) {
    return {
      txType: 'send',
      chainId: context.network.chainId,
      rpcUrl: context.network.rpcUrl,
      site: context.domainMetadata.domain,
    };
  }
};

export function AnalyticsMiddleware(
  analyticsService: AnalyticsServicePosthog
): Middleware<JsonRpcRequest, JsonRpcResponse> {
  return async (context, next) => {
		const metadata = buildMetadata(context);
		
		if (metadata) {
			const measurement = measureDuration(context.request.params.request.id);

		}
		requestsMetadata.set();
    }

    next();
  };
}
