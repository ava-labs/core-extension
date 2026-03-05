import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';
import { TransactionRequest } from 'ethers';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_FUND_TX,
  string,
  [
    data: TransactionRequest,
    challengeHex: string,
    solutionHex: string,
    fromAddress: string,
  ]
>;

@injectable()
export class FundTxHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_FUND_TX as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [data, challengeHex, solutionHex, fromAddress] = request.params;

    if (data.chainId == null) {
      return { ...request, error: 'Missing chainId in transaction data' };
    }

    try {
      const chainId = data.chainId;
      const fundTxHex = await this.gasStationService.fundTx({
        data: {
          ...(data as Record<string, unknown>),
          chainId,
        },
        challengeHex,
        solutionHex,
        fromAddress,
      });

      return {
        ...request,
        result: fundTxHex,
      };
    } catch (e: unknown) {
      return {
        ...request,
        error: String(e),
      };
    }
  };
}
