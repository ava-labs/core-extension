import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE,
  undefined
>;

@injectable()
export class FetchAndSolveChallengeHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      this.gasStationService.fetchAndSolveChallange();

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
