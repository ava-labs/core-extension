import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';
import { TransactionRequest } from 'ethers';
// import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_FUND_TX,
  undefined,
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
      await this.gasStationService.fundTx({
        data,
        challengeHex,
        solutionHex,
        fromAddress,
      });
      return {
        ...request,
        result: undefined,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
