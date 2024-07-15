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
import { buildRpcCall } from '@src/tests/test-utils';
import { addXPChainToFavoriteIfNeeded } from '../utils/addXPChainsToFavoriteIfNeeded';

jest.mock('../utils/addXPChainsToFavoriteIfNeeded');

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

jest.mock('@avalabs/wallets-sdk', () => {
  const actual = jest.requireActual('@avalabs/wallets-sdk');

  return {
    ...actual,
    getXpubFromMnemonic: jest.fn(),
    Avalanche: {
      ...actual.Avalanche,
      getXpubFromMnemonic: jest.fn(),
    },
  };
});

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
    getAccounts: jest.fn(),
    activateAccount: jest.fn(),
  } as unknown as AccountsService;
  const settingsServiceMock = {
    setAnalyticsConsent: jest.fn(),
  } as unknown as SettingsService;
  const networkServiceMock = {
    addFavoriteNetwork: jest.fn(),
    getAvalancheNetwork: jest.fn(),
    setNetwork: jest.fn(),
  } as unknown as NetworkService;
  const secretsServiceMock = {
    getWalletAccountsSecretsById: jest.fn(),
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

  it('sets up seedless wallets correctly', async () => {
    jest
      .mocked(secretsServiceMock.getWalletAccountsSecretsById)
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
        walletName: 'wallet-name',
        seedlessSignerToken: {},
        userId: '123',
        authProvider: SeedlessAuthProvider.Google,
        analyticsConsent: true,
      },
    ]);

    const result = await handler.handle(buildRpcCall(request));

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
      walletId: WALLET_ID,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(2, {
      walletId: WALLET_ID,
    });

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(true);

    expect(addXPChainToFavoriteIfNeeded).toHaveBeenCalledWith([accountMock]);
  });
});
