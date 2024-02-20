import { ChainId } from '@avalabs/chains-sdk';
import {
  Avalanche,
  DerivationPath,
  getXpubFromMnemonic,
} from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { AccountsService } from '../../accounts/AccountsService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { LockService } from '../../lock/LockService';
import { NetworkService } from '../../network/NetworkService';
import { SettingsService } from '../../settings/SettingsService';
import { StorageService } from '../../storage/StorageService';
import { WalletService } from '../../wallet/WalletService';
import { OnboardingService } from '../OnboardingService';
import { SubmitOnboardingHandler } from './submitOnboarding';
import { SecretsService } from '../../secrets/SecretsService';
import { SeedlessAuthProvider } from '../../wallet/models';
import { SecretType } from '../../secrets/models';
import {
  MemorySessionStorage,
  SignerSessionData,
} from '@cubist-labs/cubesigner-sdk';

const WALLET_ID = 'wallet-id';

jest.mock('../../seedless/SeedlessWallet');

jest.mock('@cubist-labs/cubesigner-sdk');
const mockrMemorySession = {
  MemorySessionStorage: {
    retrieve: jest.fn().mockResolvedValue({} as SignerSessionData),
  },
};

(MemorySessionStorage as jest.Mock).mockImplementation(
  () => mockrMemorySession
);

jest.mock('@avalabs/wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/wallets-sdk'),
  getXpubFromMnemonic: jest.fn(),
  Avalanche: {
    getXpubFromMnemonic: jest.fn(),
  },
}));

jest.mock('../../wallet/WalletService', () => ({
  ...jest.requireActual('../../wallet/WalletService'),
  init: jest.fn(),
}));

describe('src/background/services/onboarding/handlers/submitOnboarding.ts', () => {
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
    activateAccount: jest.fn(),
  } as unknown as AccountsService;
  const settingsServiceMock = {
    setAnalyticsConsent: jest.fn(),
  } as unknown as SettingsService;
  const networkServiceMock = {
    addFavoriteNetwork: jest.fn(),
  } as unknown as NetworkService;
  const secretsServiceMock = {
    getPrimaryAccountSecrets: jest.fn(),
  } as unknown as SecretsService;

  const accountMock = {
    id: '1',
  };

  const getHandler = () =>
    new SubmitOnboardingHandler(
      onboardingServiceMock,
      storageServiceMock,
      lockServiceMock,
      analyticsServiceMock,
      walletServiceMock,
      accountsServiceMock,
      settingsServiceMock,
      networkServiceMock,
      secretsServiceMock
    );

  const getRequest = (params: unknown[]) =>
    ({
      id: '123',
      method: ExtensionRequest.ONBOARDING_SUBMIT,
      params,
    } as any);

  beforeEach(() => {
    jest.resetAllMocks();
    (accountsServiceMock.getAccountList as jest.Mock).mockReturnValue([
      accountMock,
    ]);
    (walletServiceMock.init as jest.Mock).mockResolvedValue(WALLET_ID);
  });

  it('returns error if params are missing', async () => {
    const handler = getHandler();
    const request = getRequest([]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error:
        'unable to create a wallet, mnemonic, public key or seedless token is required',
    });
  });

  it('returns error if password is missing', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        mnemonic: 'mnemonic',
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'unable to create a wallet, password is required',
    });
  });

  it('returns error if seedless is attempted without specifying the auth provider', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        password: 'pass',
        seedlessSignerToken: {} as any,
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'Auth provider is required to create a seedless wallet',
    });
  });

  it('returns error if seedless is attempted without specifying the email address', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        password: 'pass',
        seedlessSignerToken: {} as any,
        authProvider: SeedlessAuthProvider.Apple,
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'User email is required to create a seedless wallet',
    });
  });

  it('returns error if derivation path is not determinable', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        xpub: 'xPubFromLedger',
        pubKeys: ['pubKey1'],
        password: 'password',
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: "unable to determine wallet's derivation path",
    });
  });

  it('returns error if wallet creation fails', async () => {
    (getXpubFromMnemonic as jest.Mock).mockResolvedValueOnce(undefined);

    const handler = getHandler();
    const request = getRequest([
      {
        mnemonic: 'mnemonic',
        password: 'password',
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      error: 'unable to create a wallet',
    });
  });

  it('sets up seedless wallets correctly', async () => {
    jest
      .mocked(secretsServiceMock.getPrimaryAccountSecrets)
      .mockResolvedValueOnce({
        secretType: SecretType.Seedless,
        pubKeys: [
          {
            evm: 'evm',
            xp: 'xp',
          },
          {
            evm: 'evm2',
            xp: 'xp2',
          },
        ],
      } as any);
    const handler = getHandler();
    const request = getRequest([
      {
        password: 'password',
        accountName: 'test-acc',
        seedlessSignerToken: {},
        userEmail: 'a@b.c',
        authProvider: SeedlessAuthProvider.Google,
        analyticsConsent: true,
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      result: true,
    });

    // Creates the storage key
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password'
    );

    // Initializes the wallet
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      seedlessSignerToken: undefined,
      authProvider: SeedlessAuthProvider.Google,
      userEmail: 'a@b.c',
      pubKeys: [],
      derivationPath: DerivationPath.BIP44,
      secretType: SecretType.Seedless,
    });

    // Adds all derived accounts
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenCalledTimes(2);
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(1, {
      name: 'test-acc',
      walletId: WALLET_ID,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(2, {
      name: '',
      walletId: WALLET_ID,
    });

    // // Adds favorite networks
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      1,
      ChainId.BITCOIN
    );
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      2,
      ChainId.ETHEREUM_HOMESTEAD
    );

    // // Activates the first account
    expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith(
      accountMock.id
    );
    expect(onboardingServiceMock.setIsOnboarded).toHaveBeenCalledWith(true);
    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(true);
    expect(lockServiceMock.unlock).toHaveBeenCalledWith('password');
  });

  it('sets up an mnemonic wallet correctly', async () => {
    (getXpubFromMnemonic as jest.Mock).mockResolvedValueOnce(
      'xpubFromMnemonic'
    );
    (Avalanche.getXpubFromMnemonic as jest.Mock).mockReturnValueOnce(
      'xpubFromMnemonicXP'
    );

    const handler = getHandler();
    const request = getRequest([
      {
        mnemonic: 'mnemonic',
        password: 'password',
        accountName: 'Bob',
        analyticsConsent: false,
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      result: true,
    });

    expect(getXpubFromMnemonic).toHaveBeenCalledWith('mnemonic');
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password'
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      mnemonic: 'mnemonic',
      xpub: 'xpubFromMnemonic',
      xpubXP: 'xpubFromMnemonicXP',
      derivationPath: DerivationPath.BIP44,
      secretType: SecretType.Mnemonic,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenCalledWith({
      name: 'Bob',
      walletId: WALLET_ID,
    });
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      1,
      ChainId.BITCOIN
    );
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      2,
      ChainId.ETHEREUM_HOMESTEAD
    );
    expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith(
      accountMock.id
    );
    expect(onboardingServiceMock.setIsOnboarded).toHaveBeenCalledWith(true);
    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);
    expect(lockServiceMock.unlock).toHaveBeenCalledWith('password');
    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds
    ).not.toHaveBeenCalled();
  });

  it('sets up a ledger wallet with xpub correctly', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        xpub: 'xpub',
        xpubXP: 'xpubXP',
        password: 'password',
        accountName: 'Bob',
        analyticsConsent: false,
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      result: true,
    });

    expect(getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(Avalanche.getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password'
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      mnemonic: undefined,
      xpub: 'xpub',
      xpubXP: 'xpubXP',
      derivationPath: DerivationPath.BIP44,
      secretType: SecretType.Ledger,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenCalledWith({
      name: 'Bob',
      walletId: WALLET_ID,
    });
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      1,
      ChainId.BITCOIN
    );
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      2,
      ChainId.ETHEREUM_HOMESTEAD
    );
    expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith(
      accountMock.id
    );
    expect(onboardingServiceMock.setIsOnboarded).toHaveBeenCalledWith(true);
    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);
    expect(lockServiceMock.unlock).toHaveBeenCalledWith('password');
    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds
    ).not.toHaveBeenCalled();
  });

  it('sets up a keystone wallet with xpub correctly', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        xpub: 'xpub',
        xpubXP: '',
        password: 'password',
        accountName: 'Bob',
        analyticsConsent: false,
        masterFingerprint: 'masterFingerprint',
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      result: true,
    });

    expect(getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(Avalanche.getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password'
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      xpub: 'xpub',
      masterFingerprint: 'masterFingerprint',
      derivationPath: DerivationPath.BIP44,
      secretType: SecretType.Keystone,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenCalledWith({
      name: 'Bob',
      walletId: WALLET_ID,
    });
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      1,
      ChainId.BITCOIN
    );
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      2,
      ChainId.ETHEREUM_HOMESTEAD
    );
    expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith(
      accountMock.id
    );
    expect(onboardingServiceMock.setIsOnboarded).toHaveBeenCalledWith(true);
    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);
    expect(lockServiceMock.unlock).toHaveBeenCalledWith('password');
    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds
    ).not.toHaveBeenCalled();
  });

  it('sets up a ledger wallet with pubkeys correctly', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        pubKeys: ['pubkey1', 'pubkey2', 'pubkey3'],
        password: 'password',
        accountName: 'Bob',
        analyticsConsent: false,
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      result: true,
    });

    expect(getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(Avalanche.getXpubFromMnemonic).not.toHaveBeenCalled();
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password'
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      pubKeys: ['pubkey1', 'pubkey2', 'pubkey3'],
      derivationPath: DerivationPath.LedgerLive,
      secretType: SecretType.LedgerLive,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(1, {
      name: 'Bob',
      walletId: WALLET_ID,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(2, {
      name: '',
      walletId: WALLET_ID,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(3, {
      name: '',
      walletId: WALLET_ID,
    });
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      1,
      ChainId.BITCOIN
    );
    expect(networkServiceMock.addFavoriteNetwork).toHaveBeenNthCalledWith(
      2,
      ChainId.ETHEREUM_HOMESTEAD
    );
    expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith(
      accountMock.id
    );
    expect(onboardingServiceMock.setIsOnboarded).toHaveBeenCalledWith(true);
    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);
    expect(lockServiceMock.unlock).toHaveBeenCalledWith('password');
    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds
    ).not.toHaveBeenCalled();
  });

  it('sets analytics ID if user consents', async () => {
    (getXpubFromMnemonic as jest.Mock).mockResolvedValueOnce(
      'xpubFromMnemonic'
    );
    (Avalanche.getXpubFromMnemonic as jest.Mock).mockReturnValueOnce(
      'xpubFromMnemonicXP'
    );

    const handler = getHandler();
    const request = getRequest([
      {
        mnemonic: 'mnemonic',
        password: 'password',
        accountName: 'Bob',
        analyticsConsent: true,
      },
    ]);

    const result = await handler.handle(request);

    expect(result).toEqual({
      ...request,
      result: true,
    });
    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(true);
    expect(analyticsServiceMock.saveTemporaryAnalyticsIds).toHaveBeenCalled();
  });
});
