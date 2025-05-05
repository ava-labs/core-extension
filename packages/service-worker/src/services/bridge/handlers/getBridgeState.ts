import {
  BridgeState,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { BridgeService } from '../BridgeService';

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
