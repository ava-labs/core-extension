import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

@injectable()
export class GetNetworksHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NETWORK_GET_SUPPORTED_NETWORKS];

  constructor(private networkService: NetworkService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const networks = this.networkService.supportedNetworks;
    return {
      ...request,
      result: networks,
    };
  };
}
