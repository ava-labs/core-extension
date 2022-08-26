import { ChainId } from '@avalabs/chains-sdk';
import { getXpubFromMnemonic } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { WalletService } from '../../wallet/WalletService';
import { OnboardingService } from '../OnboardingService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ONBOARDING_SUBMIT,
  true,
  [
    {
      mnemonic: string | undefined;
      xpub: string | undefined;
      password: string;
      accountName: string;
      analyticsConsent: boolean;
    }
  ]
>;

@injectable()
export class SubmitOnboardingHandler implements HandlerType {
  method = ExtensionRequest.ONBOARDING_SUBMIT as const;

  constructor(
    private onboardingService: OnboardingService,
    private storageService: StorageService,
    private lockService: LockService,
    private analyticsService: AnalyticsService,
    private walletService: WalletService,
    private accountsService: AccountsService,
    private settingsService: SettingsService,
    private networkService: NetworkService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const {
      mnemonic,
      xpub: xPubFromLedger,
      password,
      accountName,
      analyticsConsent,
    } = request.params[0];

    if (!mnemonic && !xPubFromLedger) {
      return {
        ...request,
        error: 'unable to create a wallet, mnemonic or public key required',
      };
    }

    await this.storageService.createStorageKey(password);

    const xpub =
      xPubFromLedger || (mnemonic && (await getXpubFromMnemonic(mnemonic)));

    if (xpub) {
      await this.walletService.init({ mnemonic, xpub });
    } else {
      return {
        ...request,
        error: 'unable to create a wallet',
      };
    }

    await this.accountsService.addAccount(accountName);
    await this.accountsService.activateAccount(0);
    await this.onboardingService.setIsOnboarded(true);
    await this.settingsService.setAnalyticsConsent(analyticsConsent);

    await this.networkService.addFavoriteNetwork(ChainId.BITCOIN);
    await this.networkService.addFavoriteNetwork(ChainId.ETHEREUM_HOMESTEAD);

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
