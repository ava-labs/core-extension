import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../../settings/SettingsService';
import { TokenPricesService } from '../TokenPricesService';

@injectable()
export class GetTokenPriceHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.TOKEN_PRICE_GET];

  constructor(
    private tokenPricesService: TokenPricesService,
    private settingsService: SettingsService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params;

    if (!params?.[0]) {
      return {
        ...request,
        error: 'symbol undefined',
      };
    }

    const settings = await this.settingsService.getSettings();

    return {
      ...request,
      result: await this.tokenPricesService.getPriceByCoinId(
        params[0],
        settings.currency
      ),
    };
  };
}
