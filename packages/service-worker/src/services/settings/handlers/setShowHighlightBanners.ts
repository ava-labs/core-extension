import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_SHOW_HIGHLIGHT_BANNERS,
  true,
  [show: boolean]
>;

@injectable()
export class SetShowHighlightBannersHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_SHOW_HIGHLIGHT_BANNERS as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [show] = request.params || [false];
    await this.settingsService.setShowHighlightBanners(show);

    return {
      ...request,
      result: true,
    };
  };
}
