import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { NetworkService } from '~/services/network/NetworkService';
import { TokenPricesService } from '../TokenPricesService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TOKEN_PRICE_GET_BY_ADDRESS,
  Record<string, number | null>,
  { address: string; caipId: string }
>;

@injectable()
export class GetTokenPriceByAddressHandler implements HandlerType {
  method = ExtensionRequest.TOKEN_PRICE_GET_BY_ADDRESS as const;

  constructor(
    private networkService: NetworkService,
    private tokenPricesService: TokenPricesService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { address, caipId } = request.params;

    const network = await this.networkService.getNetwork(caipId);

    if (!network) {
      return {
        ...request,
        error: 'Network not found',
      };
    }

    const result = await this.tokenPricesService.getTokenPriceByAddress(
      address,
      network,
    );

    return {
      ...request,
      result,
    };
  };
}
