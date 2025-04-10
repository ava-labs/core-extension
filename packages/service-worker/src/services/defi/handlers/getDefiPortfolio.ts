import { injectable } from 'tsyringe';

import { ExtensionRequest } from '../../../connections/extensionConnection/models';
import { ExtensionRequestHandler } from '../../../connections/models';

import { DefiPortfolio } from '../models';
import { DefiService } from '../DefiService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.DEFI_GET_PORTFOLIO,
  DefiPortfolio,
  [address: string]
>;

@injectable()
export class GetDefiPortfolioHandler implements HandlerType {
  method = ExtensionRequest.DEFI_GET_PORTFOLIO as const;

  constructor(private defiService: DefiService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [address] = request.params;

    try {
      return {
        ...request,
        result: await this.defiService.getUserPortfolio(address),
      };
    } catch (err: any) {
      return {
        ...request,
        error: err instanceof Error ? err.message : err,
      };
    }
  };
}
