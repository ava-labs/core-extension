import { BridgeConfig } from '@avalabs/core-bridge-sdk';
import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { BridgeService } from '../BridgeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_GET_CONFIG,
  BridgeConfig
>;

@injectable()
export class BridgeGetConfigHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_GET_CONFIG as const;

  constructor(private bridgeService: BridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const config = await this.bridgeService.updateBridgeConfig();
    return { ...request, result: config };
  };
}
