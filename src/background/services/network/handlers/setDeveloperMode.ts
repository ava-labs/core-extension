import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
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

  handle: HandlerType['handle'] = async (request) => {
    const [status] = request.params;

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
