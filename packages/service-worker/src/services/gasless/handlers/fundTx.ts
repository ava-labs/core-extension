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
    try {
      const fundTxHex = await this.gasStationService.fundTx({
        data,
        challengeHex,
        solutionHex,
        fromAddress,
      });

      return {
        ...request,
        result: fundTxHex,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
