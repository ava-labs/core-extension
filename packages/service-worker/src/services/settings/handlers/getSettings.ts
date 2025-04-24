import { ExtensionRequest } from '@core/types';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { SettingsState } from '@core/types';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_GET,
  SettingsState
>;

@injectable()
export class GetSettingsHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_GET as const;

  constructor(private settingsService: SettingsService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      const settings = await this.settingsService.getSettings();

      return {
        ...request,
        result: settings,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e?.toString() ?? {},
      };
    }
  };
}
