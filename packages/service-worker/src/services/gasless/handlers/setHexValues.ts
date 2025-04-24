import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';
import { DEFERRED_RESPONSE } from '../../../connections/middlewares/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_SET_HEX_VALUES,
  typeof DEFERRED_RESPONSE,
  {
    challengeHex: string;
    solutionHex: string;
    pipelineIndex: number | undefined;
  }
>;

@injectable()
export class SetGaslessHexValues implements HandlerType {
  method = ExtensionRequest.GASLESS_SET_HEX_VALUES as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const { challengeHex, solutionHex, pipelineIndex } = request.params;
      await this.gasStationService.setHexValuesAndFund({
        challengeHex,
        solutionHex,
        pipelineIndex: pipelineIndex ?? undefined,
      });
      return {
        ...request,
        result: DEFERRED_RESPONSE,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
