import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { browser } from 'webextension-polyfill-ts';
import { OnboardingService } from '../../onboarding/OnboardingService';
import { StorageService } from '../StorageService';

@injectable()
export class ResetExtensionStateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.RESET_EXTENSION_STATE];

  constructor(
    private storageService: StorageService,
    private onboardingService: OnboardingService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [openOnboarding] = request.params || [];

    await this.storageService.clearStorage();
    // make sure we arrive to the correct step of the onboarding
    await this.onboardingService.setReImportState(!!openOnboarding);

    // reload kills everyhing in memory and clears the chrome.stoage.session storage
    browser.runtime.reload();

    return {
      ...request,
      result: true,
    };
  };
}
