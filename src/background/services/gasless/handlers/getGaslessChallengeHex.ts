import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_GET_CHALLENGE_HEX,
  typeof DEFERRED_RESPONSE,
  { challangeHex: string }
>;

@injectable()
export class GetGaslessChallengeHexHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_GET_CHALLENGE_HEX as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      await this.gasStationService.setChallengeHex(
        request.challengeHex,
        request.solutionHex,
      );
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
