import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { injectable } from 'tsyringe';

@injectable()
export class BridgeGetConfigHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_GET_CONFIG];

  constructor(private bridgeService: BridgeService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const config = await this.bridgeService.updateBridgeConfig();
    return { ...request, result: config };
  };
}
