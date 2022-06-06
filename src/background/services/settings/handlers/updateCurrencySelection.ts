import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

@injectable()
export class UpdateCurrencyHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_UPDATE_CURRENCY];

  constructor(private settingsService: SettingsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [currency] = request.params || [];

    if (!currency) {
      return {
        ...request,
        error: 'currency undefined or malformed',
      };
    }

    await this.settingsService.setCurrencty(currency);

    return {
      ...request,
      result: true,
    };
  };
}
