import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  DAppRequestHandler,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

@injectable()
export class GetIsDefaultExtensionHandler
  implements ExtensionRequestHandler, DAppRequestHandler
{
  methods = [
    ExtensionRequest.SETTINGS_GET_DEFAULT_EXTENSION,
    DAppProviderRequest.GET_IS_DEFAULT_EXTENSION,
  ];

  constructor(private settingsService: SettingsService) {}

  handleAuthenticated = async (request: ExtensionConnectionMessage<any>) => {
    return await this.handleUnauthenticated(request);
  };
  handleUnauthenticated = async (request: ExtensionConnectionMessage<any>) => {
    const settings = await this.settingsService.getSettings();

    return {
      ...request,
      result: !!settings.isDefaultExtension,
    };
  };

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return await this.handleUnauthenticated(request);
  };
}
