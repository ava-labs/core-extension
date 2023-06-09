import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';
import { NetworkOverrides } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_UPDATE_DEFAULT,
  'success',
  {
    network: NetworkOverrides;
  }
>;

@injectable()
export class UpdateDefaultNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_UPDATE_DEFAULT as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async (request) => {
    const { network } = request.params;

    if (!network)
      return {
        ...request,
        error: 'Network not provided in params',
      };

    if (network.rpcUrl !== undefined) {
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
    }

    const [, err] = await resolve(
      this.networkService.updateNetworkOverrides(network)
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
