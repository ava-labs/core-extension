import {
  AvalancheDevnetMode,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_UPDATE_AVALANCHE_DEVNET_MODE,
  'success',
  [AvalancheDevnetMode]
>;

@injectable()
export class UpdateAvalancheDevnetModeHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_UPDATE_AVALANCHE_DEVNET_MODE as const;

  constructor(private networkService: NetworkService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [devnetMode] = request.params;

    if (!devnetMode) {
      return {
        ...request,
        error: 'Avalanche devnet mode not provided in params',
      };
    }

    const [, err] = await resolve(
      this.networkService.updateAvalancheDevnetMode(devnetMode),
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    return {
      ...request,
      result: 'success',
    };
  };
}
