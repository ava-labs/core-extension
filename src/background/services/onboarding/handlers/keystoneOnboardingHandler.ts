import { DerivationPath } from '@avalabs/wallets-sdk';
import { SecretType } from '../../secrets/models';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { AccountsService } from '../../accounts/AccountsService';
import { WalletService } from '../../wallet/WalletService';
import { OnboardingService } from '../OnboardingService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { injectable } from 'tsyringe';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { finalizeOnboarding } from '../finalizeOnboarding';
import { startOnboarding } from '../startOnboarding';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.KEYSTONE_ONBOARDING_SUBMIT,
  true,
  [
    {
      masterFingerprint: string;
      xpub: string;
      password: string;
      analyticsConsent: boolean;
      walletName?: string;
    }
  ]
>;

@injectable()
export class KeystoneOnboardingHandler implements HandlerType {
  method = ExtensionRequest.KEYSTONE_ONBOARDING_SUBMIT as const;

  constructor(
    private settingsService: SettingsService,
    private storageService: StorageService,
    private analyticsService: AnalyticsService,
    private accountsService: AccountsService,
    private walletService: WalletService,
    private onboardingService: OnboardingService,
    private lockService: LockService,
    private networkService: NetworkService
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { masterFingerprint, xpub, password, analyticsConsent, walletName } =
      (request.params ?? [])[0] ?? {};

    await startOnboarding({
      settingsService: this.settingsService,
      storageService: this.storageService,
      analyticsService: this.analyticsService,
      password,
      analyticsConsent,
    });

    const walletId = await this.walletService.init({
      secretType: SecretType.Keystone,
      xpub,
      masterFingerprint,
      derivationPath: DerivationPath.BIP44,
      name: walletName,
    });

    if (!walletId) {
      return {
        ...request,
        error: 'Keystone Wallet initialization failed.',
      };
    }

    await this.accountsService.addPrimaryAccount({
      walletId,
    });

    await finalizeOnboarding({
      walletId,
      networkService: this.networkService,
      accountsService: this.accountsService,
      lockService: this.lockService,
      onboardingService: this.onboardingService,
      password,
    });

    return {
      ...request,
      result: true,
    };
  };
}
