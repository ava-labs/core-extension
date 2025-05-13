import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '~/services/settings/SettingsService';
import { TokenPricesService } from '~/services/balances/TokenPricesService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TOKEN_PRICE_GET,
  number | undefined,
  [tokenId: string]
>;

@injectable()
export class GetTokenPriceHandler implements HandlerType {
  method = ExtensionRequest.TOKEN_PRICE_GET as const;

  constructor(
    private tokenPricesService: TokenPricesService,
    private settingsService: SettingsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [tokenId] = request.params;

    const settings = await this.settingsService.getSettings();

    return {
      ...request,
      result: await this.tokenPricesService.getPriceByCoinId(
        tokenId,
        settings.currency,
      ),
    };
  };
}
