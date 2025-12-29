import { DerivationPath } from '@avalabs/core-wallets-sdk';
import {
  AddressPublicKeyJson,
  ExtendedPublicKey,
  ExtensionRequest,
  ExtensionRequestHandler,
  SecretType,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { WalletService } from '../../wallet/WalletService';
import { finalizeOnboarding } from '../finalizeOnboarding';
import { OnboardingService } from '../OnboardingService';
import { startOnboarding } from '../startOnboarding';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.LEDGER_ONBOARDING_SUBMIT_NEW,
  true,
  [
    {
      addressPublicKeys: AddressPublicKeyJson[];
      extendedPublicKeys: ExtendedPublicKey[];
      password: string;
      analyticsConsent: boolean;
      derivationPathSpec: DerivationPath;
      walletName?: string;
    },
  ]
>;

@injectable()
export class LedgerOnboardingHandlerNew implements HandlerType {
  method = ExtensionRequest.LEDGER_ONBOARDING_SUBMIT_NEW as const;

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
    const [
      {
        addressPublicKeys,
        extendedPublicKeys,
        password,
        analyticsConsent,
        walletName,
        derivationPathSpec,
      },
    ] = request.params;

    await startOnboarding({
      settingsService: this.settingsService,
      storageService: this.storageService,
      analyticsService: this.analyticsService,
      password,
      analyticsConsent,
    });

    const isLedgerLive = derivationPathSpec === DerivationPath.LedgerLive;

    let walletId = '';
    if (isLedgerLive) {
      walletId = await this.walletService.init({
        secretType: SecretType.LedgerLive,
        extendedPublicKeys,
        publicKeys: addressPublicKeys,
        derivationPathSpec,
        name: walletName,
      });
    } else {
      walletId = await this.walletService.init({
        secretType: SecretType.Ledger,
        extendedPublicKeys,
        publicKeys: addressPublicKeys,
        derivationPathSpec,
        name: walletName,
      });
    }

    if (!walletId) {
      return {
        ...request,
        error: 'Ledger Wallet initialization failed.',
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

const isEvmDerivationPath = (derivationPath: string) =>
  derivationPath.startsWith(`m/44'/60'/`);
