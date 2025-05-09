import {
  ExtensionRequest,
  ExtensionRequestHandler,
  DEFERRED_RESPONSE,
} from '@core/types';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';

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
