import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_FUND_TX,
  true,
  [tx: any, challengeId: any, result: any]
>;

@injectable()
export class FundTxHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_FUND_TX as const;

  constructor() {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [tx, challengeId, result] = request.params;
    const appCheckToken = 'appchecktoken3';
    console.log('result: ', result);
    console.log('challengeId: ', challengeId);
    console.log('appCheckToken: ', appCheckToken);
    console.log('tx: ', tx);
    return {
      ...request,
      result: true,
    };
  };
}
