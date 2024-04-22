import { SecretType } from '../../secrets/models';
import { DerivationPath } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { OnboardingService } from '../OnboardingService';
import { StorageService } from '../../storage/StorageService';
import { LockService } from '../../lock/LockService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { WalletService } from '../../wallet/WalletService';
import { AccountsService } from '../../accounts/AccountsService';
import { SettingsService } from '../../settings/SettingsService';
import { NetworkService } from '../../network/NetworkService';
import { SeedlessOnboardingHandler } from './seedlessOnboardingHandler';
import { SeedlessAuthProvider } from '../../wallet/models';
import { SecretsService } from '../../secrets/SecretsService';
import {
  MemorySessionStorage,
  SignerSessionData,
} from '@cubist-labs/cubesigner-sdk';

jest.mock('@cubist-labs/cubesigner-sdk');
const mockrMemorySession = {
  MemorySessionStorage: {
    retrieve: jest.fn().mockResolvedValue({} as SignerSessionData),
  },
};

(MemorySessionStorage as jest.Mock).mockImplementation(
  () => mockrMemorySession
);

jest.mock('../../seedless/SeedlessWallet');

jest.mock('@avalabs/wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/wallets-sdk'),
  getXpubFromMnemonic: jest.fn(),
  Avalanche: {
    getXpubFromMnemonic: jest.fn(),
  },
}));

const WALLET_ID = 'wallet-id';
describe('src/background/services/onboarding/handlers/seedlessOnboardingHandler.ts', () => {
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
    new SeedlessOnboardingHandler(
      settingsServiceMock,
      storageServiceMock,
      analyticsServiceMock,
      accountsServiceMock,
      walletServiceMock,
      onboardingServiceMock,
      lockServiceMock,
      networkServiceMock,
      secretsServiceMock
    );

  const getRequest = (params: unknown[]) =>
    ({
      id: '123',
      method: ExtensionRequest.SEEDLESS_ONBOARDING_SUBMIT,
      params,
    } as any);

  beforeEach(() => {
    jest.resetAllMocks();
    (accountsServiceMock.getAccountList as jest.Mock).mockReturnValue([
      accountMock,
    ]);
    (walletServiceMock.init as jest.Mock).mockResolvedValue(WALLET_ID);
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
        walletName: 'wallet-name',
        seedlessSignerToken: {},
        userId: '123',
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
      userId: '123',
      pubKeys: [],
      derivationPath: DerivationPath.BIP44,
      secretType: SecretType.Seedless,
      name: 'wallet-name',
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

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(true);
  });
});
