import {
  ExtensionRequest,
  ExtensionRequestHandler,
  ViewMode,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_DEFAULT_VIEW,
  true,
  [viewMode: ViewMode]
>;

@injectable()
export class SetDefaultViewHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_DEFAULT_VIEW as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [viewMode] = request.params || ['floating'];

    await this.settingsService.setDefaultView(viewMode);

    return {
      ...request,
      result: true,
    };
  };
}
