import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

@injectable()
export class UpdateTokensVisiblityHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_UPDATE_TOKENS_VISIBILITY];

  constructor(private settingsService: SettingsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [tokensVisibility] = request.params || [];

    await this.settingsService.setTokensVisibility(tokensVisibility);

    return {
      ...request,
      result: true,
    };
  };
}
