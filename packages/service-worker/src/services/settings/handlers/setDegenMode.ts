import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_DEGEN_MODE,
  true,
  [enabled: boolean]
>;

@injectable()
export class SetDegenModeHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_DEGEN_MODE as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [enabled] = request.params || [false];
    await this.settingsService.setDegenMode(enabled);

    return {
      ...request,
      result: true,
    };
  };
}
