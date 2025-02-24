import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_SOLVE_CHALLENGE,
  true,
  []
  //   [appCheckToken: any]
>;

@injectable()
export class SolveGaslessChallengeHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_SOLVE_CHALLENGE as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    // const [appCheckToken] = request.params;
    const appCheckToken = 'appcheckToken2';
    console.log('appCheckToken: ', appCheckToken);
    await this.gasStationService.sendMessage(
      'test message from GASLESS_SOLVE_CHALLENGE',
    );
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ...request,
            result: true,
          }),
        3000,
      ),
    );
  };
}
