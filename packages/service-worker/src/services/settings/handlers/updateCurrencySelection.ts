import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_UPDATE_CURRENCY,
  true,
  [currency: string]
>;

@injectable()
export class UpdateCurrencyHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_UPDATE_CURRENCY as const;

  constructor(private settingsService: SettingsService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const [currency] = request.params || [];

    if (!currency) {
      return {
        ...request,
        error: 'currency undefined or malformed',
      };
    }

    await this.settingsService.setCurrency(currency);

    return {
      ...request,
      result: true,
    };
  };
}
