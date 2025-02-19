import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_SOLVE_CHALLENGE,
  true,
  [appCheckToken: any]
>;

@injectable()
export class SolveGaslessChallengeHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_SOLVE_CHALLENGE as const;

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
