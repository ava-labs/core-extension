import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_GET_DEVELOPER_MODE,
  boolean
>;

@injectable()
export class GetDevelopermodeNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_GET_DEVELOPER_MODE as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async (request) => {
    return {
      ...request,
      result: this.networkService.isDeveloperMode,
    };
  };
}
