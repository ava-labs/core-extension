import { Big } from '@avalabs/avalanche-wallet-sdk';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { PartialBridgeTransaction } from '../models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';

/**
 * Add a new pending bridge transaction to the background state and start the
 * transaction tracking process.
 */
@injectable()
export class BridgeCreateTransactionHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_TRANSACTION_CREATE];

  constructor(private bridgeService: BridgeService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const partialBridgeTransaction = (request.params?.[0] || {}) as Omit<
      PartialBridgeTransaction,
      'amount'
    > & {
      // amount is serialized when coming from the request
      amount: string;
    };
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
        new Big(amount),
        symbol
      )
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
