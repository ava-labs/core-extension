import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { TokenPricesService } from '~/services/balances/TokenPricesService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TOKEN_PRICE_GET_BY_ADDRESS,
  Record<string, number>,
  [address: string, assetPlatformId: string, coinId: string]
>;

@injectable()
export class GetTokenPriceByAddressHandler implements HandlerType {
  method = ExtensionRequest.TOKEN_PRICE_GET_BY_ADDRESS as const;

  constructor(private tokenPricesService: TokenPricesService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [address, assetPlatformId, coinId] = request.params;

    return {
      ...request,
      result: await this.tokenPricesService.getTokenPriceByAddress(
        address,
        assetPlatformId,
        coinId,
      ),
    };
  };
}
