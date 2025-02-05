import type Big from 'big.js';
import { injectable } from 'tsyringe';
import type { Asset, Blockchain } from '@avalabs/core-bridge-sdk';

import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import type { BridgeService } from '../BridgeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_ESTIMATE_GAS,
  bigint | undefined,
  [currentBlockchain: Blockchain, amountStr: Big, asset: Asset]
>;

@injectable()
export class EstimateGasForBridgeTxHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_ESTIMATE_GAS as const;

  constructor(private bridgeService: BridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    return {
      ...request,
      result: await this.bridgeService.estimateGas(...request.params),
    };
  };
}
