import { ExtensionRequestHandler } from '../../../connections/models';
import { ExtensionRequest } from '@core/types/src/models';
import { BridgeService } from '../BridgeService';
import { PartialBridgeTransaction } from '@core/types/src/models';
import { resolve } from '@core/utils';
import { injectable } from 'tsyringe';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_TRANSACTION_CREATE,
  true,
  PartialBridgeTransaction
>;

/**
 * Add a new pending bridge transaction to the background state and start the
 * transaction tracking process.
 */
@injectable()
export class BridgeCreateTransactionHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_TRANSACTION_CREATE as const;

  constructor(private bridgeService: BridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const partialBridgeTransaction = request.params;
    const {
      sourceChain,
      sourceTxHash,
      sourceStartedAt,
      targetChain,
      amount,
      symbol,
    } = partialBridgeTransaction;
    if (!sourceChain) return { ...request, error: 'missing sourceChain' };
    if (!sourceTxHash) return { ...request, error: 'missing sourceTxHash' };
    if (!sourceStartedAt)
      return { ...request, error: 'missing sourceStartedAt' };
    if (!targetChain) return { ...request, error: 'missing targetChain' };
    if (!amount) return { ...request, error: 'missing amount' };
    if (!symbol) return { ...request, error: 'missing symbol' };

    const [, error] = await resolve(
      this.bridgeService.createTransaction(
        sourceChain,
        sourceTxHash,
        sourceStartedAt,
        targetChain,
        amount,
        symbol,
      ),
    );

    if (error) {
      return {
        ...request,
        error,
      };
    }

    return {
      ...request,
      result: true,
    };
  };
}
