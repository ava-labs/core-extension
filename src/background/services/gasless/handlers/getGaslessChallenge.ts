import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_GET_CHALLENGE,
  true,
  [appCheckToken: any]
>;

@injectable()
export class GetGaslessChallengeHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_GET_CHALLENGE as const;

  constructor() {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [appCheckToken] = request.params;
    console.log('appCheckToken: ', appCheckToken);
    return {
      ...request,
      result: true,
    };
  };
}
