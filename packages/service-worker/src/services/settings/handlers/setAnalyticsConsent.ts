import { ExtensionRequest } from '@core/types';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

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
