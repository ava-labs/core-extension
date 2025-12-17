import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { TokenPricesService } from '~/services/balances/TokenPricesService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TOKEN_PRICE_GET_NATIVE,
  number | null,
  [symbol: string]
>;

@injectable()
export class GetTokenPriceHandler implements HandlerType {
  method = ExtensionRequest.TOKEN_PRICE_GET_NATIVE as const;

  constructor(private tokenPricesService: TokenPricesService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [symbol] = request.params;

    return {
      ...request,
      result: await this.tokenPricesService.getNativeTokenPrice(symbol),
    };
  };
}
