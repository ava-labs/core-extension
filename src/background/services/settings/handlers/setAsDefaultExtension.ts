import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

@injectable()
export class SetDefaultExtensionHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_SET_DEFAULT_EXTENSION];

  constructor(private settingsService: SettingsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    await this.settingsService.toggleIsDefaultExtension();

    return {
      ...request,
      result: true,
    };
  };
}
