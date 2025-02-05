import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { CollectiblesVisibility } from '../models';
import type { SettingsService } from '../SettingsService';

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
