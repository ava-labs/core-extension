import { ExtensionRequest } from '../../../connections/extensionConnection/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { BridgeService } from '../BridgeService';
import { BridgeState } from '../models';

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
