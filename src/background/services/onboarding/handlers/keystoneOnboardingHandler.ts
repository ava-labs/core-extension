import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { SecretType } from '../../secrets/models';
import type { SettingsService } from '../../settings/SettingsService';
import type { StorageService } from '../../storage/StorageService';
import type { AnalyticsService } from '../../analytics/AnalyticsService';
import type { AccountsService } from '../../accounts/AccountsService';
import type { WalletService } from '../../wallet/WalletService';
import type { OnboardingService } from '../OnboardingService';
import type { LockService } from '../../lock/LockService';
import type { NetworkService } from '../../network/NetworkService';
import { injectable } from 'tsyringe';
import type { ExtensionRequestHandler } from '@src/background/connections/models';
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
    },
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
    private networkService: NetworkService,
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
