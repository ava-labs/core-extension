import { resolve } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { OptimalRate, SwapSide } from 'paraswap-core';
import { APIError } from 'paraswap';
import { injectable } from 'tsyringe';
import { SwapService } from '../SwapService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SWAP_GET_RATE,
  {
    optimalRate: OptimalRate | APIError;
    destAmount: string | undefined;
  },
  [
    srcToken: string,
    srcDecimals: number,
    destToken: string,
    destDecimals: number,
    srcAmount: string,
    swapSide: SwapSide
  ]
>;

@injectable()
export class GetSwapRateHandler implements HandlerType {
  method = ExtensionRequest.SWAP_GET_RATE as const;

  constructor(private swapService: SwapService) {}
  handle: HandlerType['handle'] = async (request) => {
    const [
      srcToken,
      srcDecimals,
      destToken,
      destDecimals,
      srcAmount,
      swapSide,
    ] = request.params;

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
        error: (err as any).toString(),
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
