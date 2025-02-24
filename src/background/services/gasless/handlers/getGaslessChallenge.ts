import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_GET_CHALLENGE,
  true,
  // [appCheckToken: any]
  []
>;

@injectable()
export class GetGaslessChallengeHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_GET_CHALLENGE as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    // const [appCheckToken] = request.params;
    const appCheckToken = 'appCheckToken';
    console.log('appCheckToken: ', appCheckToken);
    await this.gasStationService.sendMessage(
      'test message from GASLESS_GET_CHALLENGE',
    );
    return {
      ...request,
      result: true,
    };
  };
}
