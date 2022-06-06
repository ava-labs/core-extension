import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';
import { resolve } from '@src/utils/promiseResolver';

@injectable()
export class SetDevelopermodeNetworkHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NETWORK_SET_DEVELOPER_MODE];

  constructor(private networkService: NetworkService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const { params } = request;
    const [status] = params || [];

    const [, err] = await resolve(this.networkService.setDeveloperMode(status));

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
