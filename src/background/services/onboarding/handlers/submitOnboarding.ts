import { ChainId } from '@avalabs/chains-sdk';
import {
  getXpubFromMnemonic,
  Avalanche,
  DerivationPath,
} from '@avalabs/wallets-sdk';
import {
  MemorySessionStorage,
  SignerSessionData,
} from '@cubist-labs/cubesigner-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { PubKeyType, SeedlessAuthProvider } from '../../wallet/models';
import { WalletService } from '../../wallet/WalletService';
import { OnboardingService } from '../OnboardingService';
import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { SeedlessWallet } from '../../seedless/SeedlessWallet';

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
      authProvider: SeedlessAuthProvider | undefined;
      userEmail: string | undefined;
      walletName: string | undefined;
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
    private networkService: NetworkService,
    private secretsService: SecretsService
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
      authProvider,
      userEmail,
      walletName,
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

    if (seedlessSignerToken && !authProvider) {
      return {
        ...request,
        error: 'Auth provider is required to create a seedless wallet',
      };
    }

    if (seedlessSignerToken && !userEmail) {
      return {
        ...request,
        error: 'User email is required to create a seedless wallet',
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

    // Save the analytics consent as soon as possible to avoid
    // wrongly capturing any analytics data.
    await this.settingsService.setAnalyticsConsent(analyticsConsent);

    if (analyticsConsent) {
      await this.analyticsService.saveTemporaryAnalyticsIds();
    }

    // Derive xpubXP from mnemonic / ledger
    const xpubXP = mnemonic
      ? Avalanche.getXpubFromMnemonic(mnemonic)
      : xPubXpFromLedger;

    let walletId = '';
    let secretType: SecretType | null = null;
    if (!walletId && seedlessSignerToken && userEmail) {
      secretType = SecretType.Seedless;
      const memorySessionStorage = new MemorySessionStorage(
        seedlessSignerToken
      );
      const seedlessWallet = new SeedlessWallet({
        networkService: this.networkService,
        sessionStorage: memorySessionStorage,
      });

      walletId = await this.walletService.init({
        secretType,
        pubKeys: (await seedlessWallet.getPublicKeys()) ?? [],
        seedlessSignerToken: await memorySessionStorage.retrieve(),
        userEmail,
        authProvider: authProvider ?? SeedlessAuthProvider.Google,
        derivationPath: DerivationPath.BIP44,
        name: walletName,
      });
    }

    // If we have a phrase, we know it's a mnemonic wallet
    if (!walletId && mnemonic && xpub && xpubXP) {
      secretType = SecretType.Mnemonic;
      walletId = await this.walletService.init({
        secretType,
        mnemonic,
        xpub,
        xpubXP,
        derivationPath: DerivationPath.BIP44,
        name: walletName,
      });
    }

    // If we have a master fingerprint and an xpub, we're dealing with Keystone
    if (!walletId && masterFingerprint && xpub) {
      secretType = SecretType.Keystone;
      walletId = await this.walletService.init({
        secretType: SecretType.Keystone,
        xpub,
        masterFingerprint,
        derivationPath: DerivationPath.BIP44,
        name: walletName,
      });
    }

    // If we don't have the phrase or the fingerprint, but we do have xpub,
    // we're dealing with Ledger + BIP44 derivation path
    if (!walletId && xpub) {
      secretType = SecretType.Ledger;
      walletId = await this.walletService.init({
        secretType,
        xpub,
        xpubXP,
        derivationPath: DerivationPath.BIP44,
        name: walletName,
      });
    }

    // If we have none of the above, but we do have public keys,
    // we're dealing with Ledger + LedgerLive derivation path.
    if (!walletId && pubKeys?.length) {
      secretType = SecretType.LedgerLive;
      walletId = await this.walletService.init({
        secretType: SecretType.LedgerLive,
        pubKeys,
        derivationPath: DerivationPath.LedgerLive,
        name: walletName,
      });
    }

    if (!walletId) {
      throw new Error('Wallet initialization failed.');
    }

    if (xpub) {
      await this.accountsService.addPrimaryAccount({
        name: accountName,
        walletId,
      });
    }

    if (secretType === SecretType.Seedless) {
      const secrets = await this.secretsService.getPrimaryAccountSecrets();
      if (secrets?.secretType === SecretType.Seedless) {
        // Adding accounts cannot be parallelized, they need to be added one-by-one.
        // Otherwise race conditions occur and addresses get mixed up.
        for (let i = 0; i < secrets.pubKeys.length; i++) {
          await this.accountsService.addPrimaryAccount({
            name: i === 0 ? accountName : '',
            walletId,
          });
        }
      } else {
        throw new Error('Seedless wallet initialization failed');
      }
    }

    if (pubKeys?.length) {
      for (let i = 0; i < pubKeys.length; i++) {
        const newAccountName = i === 0 ? accountName : '';
        await this.accountsService.addPrimaryAccount({
          name: newAccountName,
          walletId,
        });
      }
    }

    // add favorite networks before account activation so they can be loaded by the balances service
    await this.networkService.addFavoriteNetwork(ChainId.BITCOIN);
    await this.networkService.addFavoriteNetwork(ChainId.ETHEREUM_HOMESTEAD);

    const account = this.accountsService.getAccountList()[0];
    await this.accountsService.activateAccount(account?.id ?? '');
    await this.onboardingService.setIsOnboarded(true);

    await this.lockService.unlock(password);

    return {
      ...request,
      result: true,
    };
  };
}
