import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { injectable } from 'tsyringe';
import { resolve } from '@avalabs/utils-sdk';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_SET_IS_DEV_ENV,
  'success',
  [enabled: boolean]
>;

@injectable()
export class BridgeSetIsDevEnvHandler implements HandlerType {
  // `as const` is key to matching the types
  method = ExtensionRequest.BRIDGE_SET_IS_DEV_ENV as const;

  constructor(private bridgeService: BridgeService) {}

  handle: HandlerType['handle'] = async (request) => {
    const {
      params: [enabled],
    } = request;

    const [, err] = await resolve(this.bridgeService.setIsDevEnv(enabled));

    if (err) {
      return {
        ...request,
        error: (err as any).toString(),
      };
    }

    return {
      ...request,
      result: 'success',
    };
  };
}
