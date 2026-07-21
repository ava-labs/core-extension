import {
  HypercoreInfoClient,
  getEnv,
  type UserAbstractionMode,
} from '@avalabs/hypercore-module';
import { Environment } from '@avalabs/vm-module-types';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { isDevelopment } from '@core/common';
import { injectable } from 'tsyringe';

import { circuitBreakerFetch } from '../../../vmModules/utils';

type Params = [address: string];

export type HypercoreWithdrawableResult = {
  /** Human-readable USD amount (decimal string). */
  withdrawableUsd: string;
  abstractionMode: UserAbstractionMode | undefined;
};

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.HYPERCORE_GET_WITHDRAWABLE,
  HypercoreWithdrawableResult,
  Params
>;

@injectable()
export class GetHypercoreWithdrawableHandler implements HandlerType {
  method = ExtensionRequest.HYPERCORE_GET_WITHDRAWABLE as const;

  handle: HandlerType['handle'] = async ({ request }) => {
    const [address] = request.params ?? [];

    if (!address || typeof address !== 'string') {
      return { ...request, error: 'address is required' };
    }

    try {
      const environment = isDevelopment()
        ? Environment.DEV
        : Environment.PRODUCTION;
      const { infoUrl } = getEnv(environment);
      const infoClient = new HypercoreInfoClient({
        infoUrl,
        fetch: circuitBreakerFetch,
      });

      const { withdrawableUsd, abstractionMode } =
        await infoClient.fetchWithdrawableState(address);

      return {
        ...request,
        result: {
          // Big.js is not messaging-safe; return a plain decimal string.
          withdrawableUsd: withdrawableUsd.toFixed(),
          abstractionMode,
        },
      };
    } catch (err) {
      return { ...request, error: String(err) };
    }
  };
}
