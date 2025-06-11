import { ChainId } from '@avalabs/core-chains-sdk';
import { injectable } from 'tsyringe';
import { runtime } from 'webextension-polyfill';

import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { chainIdToCaip, resolve } from '@core/common';

import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_SET_DEVELOPER_MODE,
  'success',
  [boolean]
>;

@injectable()
export class SetDevelopermodeNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_SET_DEVELOPER_MODE as const;

  constructor(private networkService: NetworkService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [enableDeveloperMode] = request.params;
    const [, err] = await resolve(
      this.networkService.setNetwork(
        runtime.id,
        chainIdToCaip(
          enableDeveloperMode
            ? ChainId.AVALANCHE_TESTNET_ID
            : ChainId.AVALANCHE_MAINNET_ID,
        ),
      ),
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
