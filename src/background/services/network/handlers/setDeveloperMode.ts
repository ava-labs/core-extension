import { injectable } from 'tsyringe';
import { runtime } from 'webextension-polyfill';
import { ChainId } from '@avalabs/core-chains-sdk';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';

import { NetworkService } from '../NetworkService';
import { chainIdToCaip } from '@src/utils/caipConversion';

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
