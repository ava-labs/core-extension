import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { SwapService } from '../SwapService';

@injectable()
export class GetSwapRateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SWAP_GET_RATE];

  constructor(private swapService: SwapService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [
      srcToken,
      srcDecimals,
      destToken,
      destDecimals,
      srcAmount,
      swapSide,
    ] = request.params || [];

    if (!srcToken) {
      return {
        ...request,
        error: 'no source token on request',
      };
    }

    if (!destToken) {
      return {
        ...request,
        error: 'no destination token on request',
      };
    }

    if (!srcAmount) {
      return {
        ...request,
        error: 'no amount on request',
      };
    }

    if (!srcDecimals) {
      return {
        ...request,
        error: 'request requires the decimals for source token',
      };
    }

    if (!destDecimals) {
      return {
        ...request,
        error: 'request requires the decimals for destination token',
      };
    }

    const [result, err] = await resolve(
      this.swapService.getSwapRate(
        srcToken,
        srcDecimals,
        destToken,
        destDecimals,
        srcAmount,
        swapSide
      )
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    const destAmount = result.destAmount;

    return {
      ...request,
      result: {
        optimalRate: result,
        destAmount,
      },
    };
  };
}
