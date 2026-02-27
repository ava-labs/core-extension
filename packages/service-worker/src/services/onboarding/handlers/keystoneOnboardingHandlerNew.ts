import { DerivationPath } from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  ExtensionRequestHandler,
  SecretType,
  ExtendedPublicKey,
  AddressPublicKeyJson,
} from '@core/types';
import { isEvmDerivationPath, isAvalancheDerivationPath } from '@core/common';
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

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.KEYSTONE_ONBOARDING_SUBMIT_NEW,
  true,
  [
    {
      masterFingerprint: string;
      addressPublicKeys: AddressPublicKeyJson[];
      extendedPublicKeys: ExtendedPublicKey[];
      password: string;
      analyticsConsent: boolean;
      walletName?: string;
    },
  ]
>;

@injectable()
export class KeystoneOnboardingHandlerNew implements HandlerType {
  method = ExtensionRequest.KEYSTONE_ONBOARDING_SUBMIT_NEW as const;

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
      addressPublicKeys,
      extendedPublicKeys,
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

    const hasXPSupport = addressPublicKeys.some(({ derivationPath }) =>
      isAvalancheDerivationPath(derivationPath),
    );

    const walletId = await this.walletService.init({
      secretType: hasXPSupport ? SecretType.Keystone3Pro : SecretType.Keystone,
      extendedPublicKeys,
      publicKeys: addressPublicKeys,
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
    // Number of accounts is equal to the number of derived EVM public keys, since they are always provided.
    const numberOfAccounts = addressPublicKeys.filter(({ derivationPath }) =>
      isEvmDerivationPath(derivationPath),
    ).length;

    for (let i = 0; i < numberOfAccounts; i++) {
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
