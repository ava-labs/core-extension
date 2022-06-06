import { Network, ChainList } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

@injectable()
export class GetNetworksHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NETWORK_GET_NETWORKS];

  constructor(private networkService: NetworkService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [networks, err] = await resolve<ChainList>(
      this.networkService.activeNetworks.promisify()
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    const result = Object.values<Network>(networks);

    return {
      ...request,
      result,
    };
  };
}
