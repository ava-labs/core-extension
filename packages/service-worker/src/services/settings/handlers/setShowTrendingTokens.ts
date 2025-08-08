import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_SHOW_TRENDING_TOKENS,
  true,
  [show: boolean]
>;

@injectable()
export class SetShowTrendingTokensHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_SHOW_TRENDING_TOKENS as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [show] = request.params || [false];
    await this.settingsService.setShowTrendingTokens(show);

    return {
      ...request,
      result: true,
    };
  };
}
