import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  DAppRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

@injectable()
export class GetIsDefaultExtensionDAppHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.GET_IS_DEFAULT_EXTENSION];

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
}

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_GET_DEFAULT_EXTENSION,
  boolean
>;

@injectable()
export class GetIsDefaultExtensionHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_GET_DEFAULT_EXTENSION as const;

  constructor(private dappHandler: GetIsDefaultExtensionDAppHandler) {}

  handle: HandlerType['handle'] = async (request) => {
    return await this.dappHandler.handleUnauthenticated(request);
  };
}
