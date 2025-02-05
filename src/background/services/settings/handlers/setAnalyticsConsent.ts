import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import type { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_ANALYTICS_CONSENT,
  boolean,
  [consent: boolean]
>;

@injectable()
export class SetAnalyticsConsentHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_ANALYTICS_CONSENT as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [consent] = request.params || [];
    await this.settingsService.setAnalyticsConsent(consent);

    return {
      ...request,
      result: consent,
    };
  };
}
