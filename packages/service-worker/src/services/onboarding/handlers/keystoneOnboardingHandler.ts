import { DerivationPath } from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  EVM_BASE_DERIVATION_PATH,
  AVALANCHE_BASE_DERIVATION_PATH,
  SecretType,
} from '@core/types';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { AccountsService } from '../../accounts/AccountsService';
import { WalletService } from '../../wallet/WalletService';
import { OnboardingService } from '../OnboardingService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { injectable } from 'tsyringe';
import { finalizeOnboarding } from '../finalizeOnboarding';
import { startOnboarding } from '../startOnboarding';
import { buildExtendedPublicKey } from '../../secrets/utils';
import { addAllAccountsWithHistory } from '~/services/accounts/utils/addAllAccountsWithHistory';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.KEYSTONE_ONBOARDING_SUBMIT,
  true,
  [
    {
      masterFingerprint: string;
      xpub: string;
      xpubXP: string;
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
    const {
      masterFingerprint,
      xpub,
      xpubXP,
      password,
      analyticsConsent,
      walletName,
    } = (request.params ?? [])[0] ?? {};

    await startOnboarding({
      settingsService: this.settingsService,
      storageService: this.storageService,
      analyticsService: this.analyticsService,
      password,
      analyticsConsent,
    });

    const extendedPublicKeys = [
      buildExtendedPublicKey(xpub, EVM_BASE_DERIVATION_PATH),
    ];

    if (xpubXP) {
      extendedPublicKeys.push(
        buildExtendedPublicKey(xpubXP, AVALANCHE_BASE_DERIVATION_PATH),
      );
    }

    const walletId = await this.walletService.init({
      secretType: xpubXP ? SecretType.Keystone3Pro : SecretType.Keystone,
      extendedPublicKeys,
      publicKeys: [],
      masterFingerprint,
      derivationPathSpec: DerivationPath.BIP44,
      name: walletName,
    });

    if (!walletId) {
      return {
        ...request,
        error: 'Keystone Wallet initialization failed.',
      };
    }

    await addAllAccountsWithHistory({ walletId });

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
