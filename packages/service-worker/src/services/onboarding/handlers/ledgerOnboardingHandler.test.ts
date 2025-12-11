import {
  Avalanche,
  DerivationPath,
  getXpubFromMnemonic,
  getAddressDerivationPath,
} from '@avalabs/core-wallets-sdk';
import {
  ExtensionRequest,
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
  SecretType,
} from '@core/types';
import { AccountsService } from '../../accounts/AccountsService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { WalletService } from '../../wallet/WalletService';
import { OnboardingService } from '../OnboardingService';
import { LedgerOnboardingHandler } from './ledgerOnboardingHandler';
import { buildRpcCall } from '@shared/tests/test-utils';
import { buildExtendedPublicKey } from '../../secrets/utils';
import { addChainsToFavoriteIfNeeded } from '../utils/addChainsToFavoriteIfNeeded';
import { addAllAccountsWithHistory } from '~/services/accounts/utils/addAllAccountsWithHistory';

jest.mock('../utils/addChainsToFavoriteIfNeeded');
jest.mock('~/services/accounts/utils/addAllAccountsWithHistory', () => ({
  addAllAccountsWithHistory: jest.fn(),
}));

const WALLET_ID = 'wallet-id';

jest.mock('@avalabs/core-wallets-sdk', () => {
  const actual = jest.requireActual('@avalabs/core-wallets-sdk');

  return {
    ...actual,
    getXpubFromMnemonic: jest.fn(),
    Avalanche: {
      ...actual.Avalanche,
      getXpubFromMnemonic: jest.fn(),
    },
  };
});

describe('src/background/services/onboarding/handlers/ledgerOnboardingHandler.ts', () => {
  const onboardingServiceMock = {
    setIsOnboarded: jest.fn(),
  } as unknown as OnboardingService;
  const storageServiceMock = {
    createStorageKey: jest.fn(),
  } as unknown as StorageService;
  const lockServiceMock = {
    unlock: jest.fn(),
  } as unknown as LockService;
  const analyticsServiceMock = {
    saveTemporaryAnalyticsIds: jest.fn(),
  } as unknown as AnalyticsService;
  const walletServiceMock = {
    init: jest.fn(),
  } as unknown as WalletService;
  const accountsServiceMock = {
    addPrimaryAccount: jest.fn(),
    getAccountList: jest.fn(),
    getAccounts: jest.fn(),
    activateAccount: jest.fn(),
  } as unknown as AccountsService;
  const settingsServiceMock = {
    setAnalyticsConsent: jest.fn(),
  } as unknown as SettingsService;
  const networkServiceMock = {
    enableNetwork: jest.fn(),
    getAvalancheNetwork: jest.fn(),
    setNetwork: jest.fn(),
  } as unknown as NetworkService;

  const accountMock = {
    id: '1',
  };

  const getHandler = () =>
    new LedgerOnboardingHandler(
      settingsServiceMock,
      storageServiceMock,
      analyticsServiceMock,
      accountsServiceMock,
      walletServiceMock,
      onboardingServiceMock,
      lockServiceMock,
      networkServiceMock,
    );

  const getRequest = (params: unknown[]) =>
    ({
      id: '123',
      method: ExtensionRequest.LEDGER_ONBOARDING_SUBMIT,
      params,
    }) as any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(accountsServiceMock.getAccounts).mockReturnValue({
      primary: {
        [WALLET_ID]: [accountMock],
      },
    } as any);
    (accountsServiceMock.getAccountList as jest.Mock).mockReturnValue([
      accountMock,
    ]);
    (walletServiceMock.init as jest.Mock).mockResolvedValue(WALLET_ID);
    jest
      .mocked(networkServiceMock.getAvalancheNetwork)
      .mockResolvedValue({ chainId: 43114 } as any);
  });
  it('sets up a ledger wallet with xpub correctly', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        xpub: 'xpub',
        xpubXP: 'xpubXP',
        password: 'password',
        walletName: 'wallet-name',
        analyticsConsent: false,
        numberOfAccountsToCreate: 1,
      },
    ]);

    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: true,
    });

    expect(getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(Avalanche.getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password',
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      mnemonic: undefined,
      extendedPublicKeys: [
        buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
        buildExtendedPublicKey('xpubXP', AVALANCHE_BASE_DERIVATION_PATH),
      ],
      publicKeys: [],
      derivationPathSpec: DerivationPath.BIP44,
      secretType: SecretType.Ledger,
      name: 'wallet-name',
    });
    expect(addAllAccountsWithHistory).toHaveBeenCalledWith({
      walletId: WALLET_ID,
      addFirstAccount: true,
    });

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);

    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds,
    ).not.toHaveBeenCalled();
  });

  it('sets up a ledger wallet with extended keys and solana keys correctly', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        xpub: 'xpub',
        xpubXP: 'xpubXP',
        pubKeys: [
          { evm: '', svm: 'svm1' },
          { evm: '', svm: 'svm2' },
        ],
        password: 'password',
        walletName: 'wallet-name',
        analyticsConsent: false,
        numberOfAccountsToCreate: 2,
      },
    ]);

    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: true,
    });

    expect(getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(Avalanche.getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password',
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      mnemonic: undefined,
      extendedPublicKeys: [
        buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
        buildExtendedPublicKey('xpubXP', AVALANCHE_BASE_DERIVATION_PATH),
      ],
      publicKeys: [
        {
          curve: 'ed25519',
          derivationPath: "m/44'/501'/0'/0'",
          key: 'svm1',
          type: 'address-pubkey',
        },
        {
          curve: 'ed25519',
          derivationPath: "m/44'/501'/1'/0'",
          key: 'svm2',
          type: 'address-pubkey',
        },
      ],
      derivationPathSpec: DerivationPath.BIP44,
      secretType: SecretType.Ledger,
      name: 'wallet-name',
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenCalledWith({
      walletId: WALLET_ID,
    });

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);

    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds,
    ).not.toHaveBeenCalled();
  });

  it('sets up a ledger wallet with pubkeys correctly with right amount of accounts', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        pubKeys: [
          { evm: 'evm1', xp: 'xp1' },
          { evm: 'evm2', xp: 'xp2' },
        ],
        password: 'password',
        walletName: 'wallet-name',
        analyticsConsent: false,
        numberOfAccountsToCreate: 2,
      },
    ]);

    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: true,
    });

    expect(getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(Avalanche.getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password',
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      extendedPublicKeys: [],
      publicKeys: [
        {
          curve: 'secp256k1',
          key: 'evm1',
          derivationPath: getAddressDerivationPath(0, 'EVM', {
            pathSpec: DerivationPath.LedgerLive,
          }),
          type: 'address-pubkey',
        },
        {
          curve: 'secp256k1',
          key: 'xp1',
          derivationPath: getAddressDerivationPath(0, 'AVM', {
            pathSpec: DerivationPath.LedgerLive,
          }),
          type: 'address-pubkey',
        },
        {
          curve: 'secp256k1',
          key: 'evm2',
          derivationPath: getAddressDerivationPath(1, 'EVM', {
            pathSpec: DerivationPath.LedgerLive,
          }),
          type: 'address-pubkey',
        },
        {
          curve: 'secp256k1',
          key: 'xp2',
          derivationPath: getAddressDerivationPath(1, 'AVM', {
            pathSpec: DerivationPath.LedgerLive,
          }),
          type: 'address-pubkey',
        },
      ],
      derivationPathSpec: DerivationPath.LedgerLive,
      secretType: SecretType.LedgerLive,
      name: 'wallet-name',
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(1, {
      walletId: WALLET_ID,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(2, {
      walletId: WALLET_ID,
    });
    expect(accountsServiceMock.addPrimaryAccount).not.toHaveBeenNthCalledWith(
      3,
      {
        walletId: WALLET_ID,
      },
    );

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);

    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds,
    ).not.toHaveBeenCalled();

    expect(addChainsToFavoriteIfNeeded).toHaveBeenCalledWith([accountMock]);
  });
});
