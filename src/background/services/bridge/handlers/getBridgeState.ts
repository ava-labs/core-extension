import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { BridgeService } from '../BridgeService';
import type { BridgeState } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_GET_STATE,
  BridgeState
>;

@injectable()
export class BridgeGetStateHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_GET_STATE as const;

  constructor(private bridgeService: BridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    return {
      ...request,
      result: this.bridgeService.bridgeState,
    };
  };
}
