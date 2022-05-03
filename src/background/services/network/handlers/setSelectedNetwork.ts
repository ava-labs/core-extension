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
export class SetSelectedNetworkHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NETWORK_SET_SELECTED];

  constructor(private networkService: NetworkService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const { params } = request;
    const [networkName] = params || [];

    if (!networkName) {
      return {
        ...request,
        error: 'network name missing in params',
      };
    }

    const [, err] = await resolve(this.networkService.setNetwork(networkName));

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
