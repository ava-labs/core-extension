import {
  CustomNetworkPayload,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_SAVE_CUSTOM,
  'success',
  [CustomNetworkPayload]
>;

@injectable()
export class SaveCustomNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_SAVE_CUSTOM as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const { params } = request;
    const network = params?.[0];

    if (!network)
      return {
        ...request,
        error: 'Network not provided in params',
      };

    const isValid = await this.networkService.isValidRPCUrl(
      network.chainId,
      network.rpcUrl,
    );

    if (!isValid) {
      return {
        ...request,
        error: 'ChainID does not match the rpc url',
      };
    }

    const [addedNetwork, err] = await resolve(
      this.networkService.saveCustomNetwork(network),
    );

    if (err || !addedNetwork) {
      return {
        ...request,
        error: err?.toString() ?? 'Adding custom network failed',
      };
    }

    return {
      ...request,
      result: 'success',
    };
  };
}
