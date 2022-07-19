import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_DEFAULT_EXTENSION,
  true
>;

@injectable()
export class SetDefaultExtensionHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_DEFAULT_EXTENSION as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async (request) => {
    await this.settingsService.toggleIsDefaultExtension();

    return {
      ...request,
      result: true,
    };
  };
}
