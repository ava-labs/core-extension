import { ChainId } from '@avalabs/chains-sdk';
import { getXpubFromMnemonic, Avalanche } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { PubKeyType } from '../../wallet/models';
import { WalletService } from '../../wallet/WalletService';
import { OnboardingService } from '../OnboardingService';
import { SignerSessionData } from '@cubist-dev/cubesigner-sdk';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ONBOARDING_SUBMIT,
  true,
  [
    {
      mnemonic: string | undefined;
      xpub: string | undefined;
      xpubXP: string | undefined;
      password: string;
      accountName: string;
      analyticsConsent: boolean;
      pubKeys: PubKeyType[] | undefined;
      masterFingerprint: string | undefined;
      seedlessSignerToken: SignerSessionData | undefined;
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
      xpub: xPubFromHardware,
      xpubXP: xPubXpFromLedger,
      password,
      accountName,
      analyticsConsent,
      pubKeys,
      masterFingerprint,
      seedlessSignerToken,
    } = (request.params ?? [])[0] ?? {};

    if (!seedlessSignerToken && !mnemonic && !xPubFromHardware && !pubKeys) {
      return {
        ...request,
        error:
          'unable to create a wallet, mnemonic, public key or seedless token is required',
      };
    }

    if (!password) {
      return {
        ...request,
        error: 'unable to create a wallet, password is required',
      };
    }

    // the payload shouldn't contain both xpub and pubkeys
    // it's not possible to determine which one to use, so we throw an error here
    if (xPubFromHardware && pubKeys?.length) {
      return {
        ...request,
        error: "unable to determine wallet's derivation path",
      };
    }

    // XPUB form EVM m/44'/60'/0'
    const xpub =
      xPubFromHardware || (mnemonic && (await getXpubFromMnemonic(mnemonic)));

    if (!xpub && !pubKeys && !seedlessSignerToken) {
      return {
        ...request,
        error: 'unable to create a wallet',
      };
    }

    await this.storageService.createStorageKey(password);

    // Derive xpubXP from mnemonic / ledger
    const xpubXP = mnemonic
      ? Avalanche.getXpubFromMnemonic(mnemonic)
      : xPubXpFromLedger;

    if (xpub) {
      await this.walletService.init({
        mnemonic,
        xpub,
        xpubXP,
        masterFingerprint,
      });
      await this.accountsService.addAccount(accountName);
    } else if (seedlessSignerToken) {
      await this.walletService.init({ seedlessSignerToken });
      await this.accountsService.addAccount(accountName);
    } else if (pubKeys?.length) {
      await this.walletService.init({ pubKeys });
      for (let i = 0; i < pubKeys.length; i++) {
        const newAccountName = i === 0 ? accountName : '';
        await this.accountsService.addAccount(newAccountName);
      }
    }
    // add favorite networks before account activation so they can be loaded by the balances service
    await this.networkService.addFavoriteNetwork(ChainId.BITCOIN);
    await this.networkService.addFavoriteNetwork(ChainId.ETHEREUM_HOMESTEAD);

    const account = this.accountsService.getAccountList()[0];
    await this.accountsService.activateAccount(account?.id ?? '');
    await this.onboardingService.setIsOnboarded(true);
    await this.settingsService.setAnalyticsConsent(analyticsConsent);

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
