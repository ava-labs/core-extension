import {
  ExtensionRequest,
  ExtensionRequestHandler,
  TokensVisibility,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_UPDATE_TOKENS_VISIBILITY,
  true,
  [tokensVisibility: TokensVisibility]
>;

@injectable()
export class UpdateTokensVisiblityHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_UPDATE_TOKENS_VISIBILITY as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [tokensVisibility] = request.params;

    await this.settingsService.setTokensVisibility(tokensVisibility);

    return {
      ...request,
      result: true,
    };
  };
}
