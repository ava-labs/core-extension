import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { injectable } from 'tsyringe';
import { resolve } from '@avalabs/utils-sdk';

@injectable()
export class BridgeSetIsDevEnvHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_SET_IS_DEV_ENV];

  constructor(private bridgeService: BridgeService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const { params } = request;
    const [enabled] = params || [];

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
