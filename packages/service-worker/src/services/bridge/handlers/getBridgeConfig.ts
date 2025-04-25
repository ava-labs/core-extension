import { BridgeConfig } from '@avalabs/core-bridge-sdk';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { BridgeService } from '../BridgeService';

export type HandlerType = ExtensionRequestHandler<
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
