import {
  ExtensionRequest,
  ExtensionRequestHandler,
  CollectiblesVisibility,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_UPDATE_COLLECTIBLES_VISIBILITY,
  true,
  [collectiblesVisibility: CollectiblesVisibility]
>;

@injectable()
export class UpdateCollectiblesVisibilityHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_UPDATE_COLLECTIBLES_VISIBILITY as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [collectiblesVisibility] = request.params;

    await this.settingsService.setCollectiblesVisibility(
      collectiblesVisibility,
    );

    return {
      ...request,
      result: true,
    };
  };
}
