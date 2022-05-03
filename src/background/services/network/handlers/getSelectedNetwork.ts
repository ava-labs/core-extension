import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

@injectable()
export class GetSelectedNetworkHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NETWORK_GET_SELECTED];

  constructor(private networkService: NetworkService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: this.networkService.activeNetwork,
    };
  };
}
