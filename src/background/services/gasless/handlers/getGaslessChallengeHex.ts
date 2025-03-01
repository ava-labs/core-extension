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

  // e5bb36325ad177ebfda7737ed0ec9caa15eca82a353ad1145c5fc1a0f11df165
  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const pipelineIndex = request.pipelineIndex;
      await this.gasStationService.setChallengeHex(
        request.challengeHex,
        request.solutionHex,
        // TODO: remove these comment they can simulate the RETRY and DO NOT RETRY errors at the moment
        // 'fail',
        // pipelineIndex === 0
        //   ? // ? request.solutionHex
        //     'fail'
        //   : 'e5bb36325ad177ebfda7737ed0ec9caa15eca82a353ad1145c5fc1a0f11df165',
        pipelineIndex ?? undefined,
        // 'e5bb36325ad177ebfda7737ed0ec9caa15eca82a353ad1145c5fc1a0f11df165',
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
