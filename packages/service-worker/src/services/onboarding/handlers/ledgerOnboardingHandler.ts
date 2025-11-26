import {
  DerivationPath,
  getAddressDerivationPath,
  getSolanaDerivationPath,
} from '@avalabs/core-wallets-sdk';
import {
  AVALANCHE_BASE_DERIVATION_PATH,
  AddressPublicKeyJson,
  EVM_BASE_DERIVATION_PATH,
  ExtensionRequest,
  ExtensionRequestHandler,
  PubKeyType,
  SecretType,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { buildExtendedPublicKey } from '../../secrets/utils';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { WalletService } from '../../wallet/WalletService';
import { finalizeOnboarding } from '../finalizeOnboarding';
import { OnboardingService } from '../OnboardingService';
import { startOnboarding } from '../startOnboarding';
import { isNotNullish } from '@core/common';
import { addAllAccountsWithHistory } from '~/services/accounts/utils/addAllAccountsWithHistory';

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
      numberOfAccountsToCreate: number;
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

    if (xpub || xpubXP) {
      const hasNonSolanaKeys = pubKeys?.some(
        (pubKey) => pubKey.evm || pubKey.xp,
      );

      if (hasNonSolanaKeys) {
        return {
          ...request,
          error:
            'Conflicting payload: both XPub and non-Solana public keys array are provided',
        };
      }

      const numberOfSolanaKeys = pubKeys
        ? pubKeys.filter((pubKey) => pubKey.svm).length
        : 0;

      if (
        numberOfSolanaKeys > 0 &&
        numberOfSolanaKeys < numberOfAccountsToCreate
      ) {
        return {
          ...request,
          error: `Mismatching payload: expected ${numberOfAccountsToCreate} Solana public keys, got ${numberOfSolanaKeys}`,
        };
      }
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
      const solanaKeys = (pubKeys ?? [])
        .map((pubKey, index) => {
          if (!pubKey.svm) {
            return null;
          }

          return {
            type: 'address-pubkey',
            curve: 'ed25519',
            derivationPath: getSolanaDerivationPath(index),
            key: pubKey.svm,
          } as const;
        })
        .filter(isNotNullish);

      walletId = await this.walletService.init({
        secretType: SecretType.Ledger,
        extendedPublicKeys: [
          buildExtendedPublicKey(xpub, EVM_BASE_DERIVATION_PATH),
          buildExtendedPublicKey(xpubXP, AVALANCHE_BASE_DERIVATION_PATH),
        ],
        publicKeys: solanaKeys,
        derivationPathSpec: DerivationPath.BIP44,
        name: walletName,
      });
    } else if (pubKeys?.length) {
      const publicKeys: AddressPublicKeyJson<true>[] = [];

      for (const [index, pubKey] of pubKeys.entries()) {
        publicKeys.push({
          curve: 'secp256k1',
          key: pubKey.evm,
          derivationPath: getAddressDerivationPath(index, 'EVM', {
            pathSpec: DerivationPath.LedgerLive,
          }),
          type: 'address-pubkey',
        });

        if (pubKey.xp) {
          publicKeys.push({
            curve: 'secp256k1',
            key: pubKey.xp,
            derivationPath: getAddressDerivationPath(index, 'AVM', {
              pathSpec: DerivationPath.LedgerLive,
            }),
            type: 'address-pubkey',
          });
        }

        if (pubKey.svm) {
          publicKeys.push({
            curve: 'ed25519',
            key: pubKey.svm,
            derivationPath: getSolanaDerivationPath(index),
            type: 'address-pubkey',
          });
        }
      }

      walletId = await this.walletService.init({
        secretType: SecretType.LedgerLive,
        publicKeys,
        derivationPathSpec: DerivationPath.LedgerLive,
        extendedPublicKeys: [],
        name: walletName,
      });
    }

    if (!walletId) {
      return {
        ...request,
        error: 'Ledger Wallet initialization failed.',
      };
    }

    if (pubKeys?.length) {
      for (let i = 0; i < (numberOfAccountsToCreate || 1); i++) {
        if (pubKeys && pubKeys.length < i) {
          break;
        }
        await this.accountsService.addPrimaryAccount({
          walletId,
        });
      }
    } else {
      await addAllAccountsWithHistory({ walletId });
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
