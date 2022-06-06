import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';
@injectable()
export class GetSettingsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_GET];

  constructor(private settingsService: SettingsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    try {
      const settings = await this.settingsService.getSettings();

      return {
        ...request,
        result: settings ?? {},
      };
    } catch (e: any) {
      return {
        ...request,
        error: e?.toString() ?? {},
      };
    }
  };
}
