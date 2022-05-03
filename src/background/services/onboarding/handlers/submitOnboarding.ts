import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { LockService } from '../../lock/LockService';
import { StorageService } from '../../storage/StorageService';
import { WalletService } from '../../wallet/WalletService';
import { OnboardingService } from '../OnboardingService';

@injectable()
export class SubmitOnboardingHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ONBOARDING_SUBMIT];

  constructor(
    private onboardingService: OnboardingService,
    private storageService: StorageService,
    private lockService: LockService,
    private analyticsService: AnalyticsService,
    private walletService: WalletService,
    private accountsService: AccountsService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params;
    if (!params) {
      return {
        ...request,
        error: 'params missing from request',
      };
    }
    const { mnemonic, publicKey, password, accountName, analyticsConsent } =
      params[0];

    await this.storageService.createStorageKey(password);

    if (mnemonic || publicKey) {
      await this.walletService.init({ mnemonic, password, publicKey });
    } else {
      return {
        ...request,
        error: 'unable to create a wallet',
      };
    }

    await this.accountsService.addAccount(accountName);
    await this.accountsService.activateAccount(0);
    await this.onboardingService.setIsOnboarded(true);

    await this.lockService.unlock(password);

    if (analyticsConsent) {
      await this.analyticsService.saveTemporaryAnalyticsIds();
    }

    return {
      ...request,
      result: true,
    };
  };
}
