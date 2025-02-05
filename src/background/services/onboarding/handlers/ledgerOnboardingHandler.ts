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
import type { PubKeyType } from '../../wallet/models';
import { finalizeOnboarding } from '../finalizeOnboarding';
import { startOnboarding } from '../startOnboarding';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_ONBOARDING_SUBMIT,
  true,
  [
    {
      xpub?: string;
      xpubXP?: string;
      pubKeys?: PubKeyType[];
      password: string;
      analyticsConsent: boolean;
      walletName?: string;
      numberOfAccountsToCreate?: number;
    },
  ]
>;

@injectable()
export class LedgerOnboardingHandler implements HandlerType {
  method = ExtensionRequest.LEDGER_ONBOARDING_SUBMIT as const;

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
    const {
      xpub,
      xpubXP,
      pubKeys,
      password,
      analyticsConsent,
      walletName,
      numberOfAccountsToCreate,
    } = (request.params ?? [])[0] ?? {};

    if ((xpub || xpubXP) && pubKeys?.length) {
      return {
        ...request,
        error:
          'Conflicting payload: both XPub and public keys array are provided',
      };
    }

    await startOnboarding({
      settingsService: this.settingsService,
      storageService: this.storageService,
      analyticsService: this.analyticsService,
      password,
      analyticsConsent,
    });

    let walletId = '';
    if (xpub && xpubXP) {
      walletId = await this.walletService.init({
        secretType: SecretType.Ledger,
        xpub,
        xpubXP,
        derivationPath: DerivationPath.BIP44,
        name: walletName,
      });
    }

    if (pubKeys?.length) {
      walletId = await this.walletService.init({
        secretType: SecretType.LedgerLive,
        pubKeys,
        derivationPath: DerivationPath.LedgerLive,
        name: walletName,
      });
    }

    if (!walletId) {
      return {
        ...request,
        error: 'Ledger Wallet initialization failed.',
      };
    }

    for (let i = 0; i < (numberOfAccountsToCreate || 1); i++) {
      if (pubKeys && pubKeys.length < i) {
        break;
      }
      await this.accountsService.addPrimaryAccount({
        walletId,
      });
    }

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
