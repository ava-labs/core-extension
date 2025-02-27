import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_FETCH_CHALLENGE,
  typeof DEFERRED_RESPONSE
>;

@injectable()
export class FetchGaslessChallengeHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_FETCH_CHALLENGE as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      this.gasStationService.fetchChallange();

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
