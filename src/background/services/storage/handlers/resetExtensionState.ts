import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import browser from 'webextension-polyfill';
import type { AnalyticsService } from '../../analytics/AnalyticsService';
import type { OnboardingService } from '../../onboarding/OnboardingService';
import type { StorageService } from '../StorageService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.RESET_EXTENSION_STATE,
  true,
  [openOnboarding: boolean]
>;

@injectable()
export class ResetExtensionStateHandler implements HandlerType {
  method = ExtensionRequest.RESET_EXTENSION_STATE as const;

  constructor(
    private storageService: StorageService,
    private onboardingService: OnboardingService,
    private analyticsService: AnalyticsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [openOnboarding] = request.params;

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
