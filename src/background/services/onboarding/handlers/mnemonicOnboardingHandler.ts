import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { StorageService } from '../../storage/StorageService';
import { SettingsService } from '../../settings/SettingsService';
import { SecretType } from '../../secrets/models';
import { WalletService } from '../../wallet/WalletService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import {
  Avalanche,
  DerivationPath,
  getXpubFromMnemonic,
} from '@avalabs/wallets-sdk';
import { AccountsService } from '../../accounts/AccountsService';
import { OnboardingService } from '../OnboardingService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { injectable } from 'tsyringe';
import { finalizeOnboarding } from '../finalizeOnboarding';
import { startOnboarding } from '../startOnboarding';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.MNEMONIC_ONBOARDING_SUBMIT,
  true,
  [
    {
      mnemonic: string;
      password: string;
      accountName: string;
      analyticsConsent: boolean;
      walletName?: string;
    }
  ]
>;

@injectable()
export class MnemonicOnboardingHandler implements HandlerType {
  method = ExtensionRequest.MNEMONIC_ONBOARDING_SUBMIT as const;

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

  handle: HandlerType['handle'] = async (request) => {
    const {
      mnemonic: rawMnemonic,
      password,
      accountName,
      analyticsConsent,
      walletName,
    } = (request.params ?? [])[0] ?? {};

    const mnemonic = rawMnemonic.toLowerCase(); // BIP39 seed phrases are case-insensitive
    const xpub = await getXpubFromMnemonic(mnemonic);
    const xpubXP = Avalanche.getXpubFromMnemonic(mnemonic);

    await startOnboarding({
      settingsService: this.settingsService,
      storageService: this.storageService,
      analyticsService: this.analyticsService,
      password,
      analyticsConsent,
    });

    const walletId = await this.walletService.init({
      secretType: SecretType.Mnemonic,
      mnemonic,
      xpub,
      xpubXP,
      derivationPath: DerivationPath.BIP44,
      name: walletName,
    });

    if (!walletId) {
      return {
        ...request,
        error: 'Mnemonic Wallet initialization failed.',
      };
    }

    await this.accountsService.addPrimaryAccount({
      name: accountName,
      walletId,
    });

    await finalizeOnboarding({
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
