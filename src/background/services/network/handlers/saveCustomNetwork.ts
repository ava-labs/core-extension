import { Network } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_SAVE_CUSTOM,
  'success',
  [Network]
>;

@injectable()
export class SaveCustomNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_SAVE_CUSTOM as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const { params } = request;
    const network: Network = params?.[0];

    if (!network)
      return {
        ...request,
        error: 'Network not provided in params',
      };

    const isValid = await this.networkService.isValidRPCUrl(
      network.chainId,
      network.rpcUrl
    );

    if (!isValid) {
      return {
        ...request,
        error: 'ChainID does not match the rpc url',
      };
    }

    const [, err] = await resolve(
      this.networkService.saveCustomNetwork(network)
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
