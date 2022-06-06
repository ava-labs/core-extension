import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { browser } from 'webextension-polyfill-ts';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import { StorageService } from '../StorageService';

@injectable()
export class ResetExtensionStateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.RESET_EXTENSION_STATE];

  constructor(
    private storageService: StorageService,
    private onboardingService: OnboardingService,
    private analyticsService: AnalyticsService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [openOnboarding] = request.params || [];

    const deviceId = await this.analyticsService.getUnencryptedDeviceId();

    await this.storageService.clearStorage();

    // make sure we arrive to the correct step of the onboarding
    await this.onboardingService.setReImportState(!!openOnboarding);

    // restore the device id for posthog
    await this.analyticsService.setUnencryptedDeviceId(deviceId);

    // reload kills everyhing in memory and clears the chrome.stoage.session storage
    browser.runtime.reload();

    return {
      ...request,
      result: true,
    };
  };
}
