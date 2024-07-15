import {
  MemorySessionStorage,
  SignerSessionData,
} from '@cubist-labs/cubesigner-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SecretType } from '../../secrets/models';
import { SeedlessWallet } from '../../seedless/SeedlessWallet';
import { SeedlessAuthProvider } from '../../wallet/models';
import { DerivationPath } from '@avalabs/wallets-sdk';
import { SecretsService } from '../../secrets/SecretsService';
import { NetworkService } from '../../network/NetworkService';
import { WalletService } from '../../wallet/WalletService';
import { AccountsService } from '../../accounts/AccountsService';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { OnboardingService } from '../OnboardingService';
import { LockService } from '../../lock/LockService';
import { finalizeOnboarding } from '../finalizeOnboarding';
import { startOnboarding } from '../startOnboarding';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SEEDLESS_ONBOARDING_SUBMIT,
  true,
  [
    {
      seedlessSignerToken: SignerSessionData;
      userId: string;
      password: string;
      analyticsConsent: boolean;
      walletName?: string;
      authProvider: SeedlessAuthProvider;
    }
  ]
>;

@injectable()
export class SeedlessOnboardingHandler implements HandlerType {
  method = ExtensionRequest.SEEDLESS_ONBOARDING_SUBMIT as const;

  constructor(
    private settingsService: SettingsService,
    private storageService: StorageService,
    private analyticsService: AnalyticsService,
    private accountsService: AccountsService,
    private walletService: WalletService,
    private onboardingService: OnboardingService,
    private lockService: LockService,
    private networkService: NetworkService,
    private secretsService: SecretsService
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const {
      seedlessSignerToken,
      userId,
      authProvider,
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

    const memorySessionStorage = new MemorySessionStorage(seedlessSignerToken);
    const seedlessWallet = new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: memorySessionStorage,
    });

    const walletId = await this.walletService.init({
      secretType: SecretType.Seedless,
      pubKeys: (await seedlessWallet.getPublicKeys()) ?? [],
      seedlessSignerToken: await memorySessionStorage.retrieve(),
      userId,
      authProvider,
      derivationPath: DerivationPath.BIP44,
      name: walletName,
    });

    if (!walletId) {
      return {
        ...request,
        error: 'Seedless Wallet initialization failed.',
      };
    }

    const secrets = await this.secretsService.getWalletAccountsSecretsById(
      walletId
    );
    if (secrets?.secretType === SecretType.Seedless) {
      // Adding accounts cannot be parallelized, they need to be added one-by-one.
      // Otherwise race conditions occur and addresses get mixed up.
      for (let i = 0; i < secrets.pubKeys.length; i++) {
        await this.accountsService.addPrimaryAccount({
          walletId,
        });
      }
    } else {
      return {
        ...request,
        error: 'Seedless Wallet initialization failed.',
      };
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
