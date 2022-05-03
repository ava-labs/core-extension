import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

@injectable()
export class SetAnalyticsConsentHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_SET_ANALYTICS_CONSENT];

  constructor(private settingsService: SettingsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [consent] = request.params || [];
    await this.settingsService.setAnalyticsConsent(!!consent);

    return {
      ...request,
      result: consent,
    };
  };
}
