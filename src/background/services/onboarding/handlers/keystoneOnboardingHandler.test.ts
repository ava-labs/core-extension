import { EVM_BASE_DERIVATION_PATH, SecretType } from '../../secrets/models';
import {
  Avalanche,
  DerivationPath,
  getXpubFromMnemonic,
} from '@avalabs/core-wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { OnboardingService } from '../OnboardingService';
import { StorageService } from '../../storage/StorageService';
import { LockService } from '../../lock/LockService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { WalletService } from '../../wallet/WalletService';
import { AccountsService } from '../../accounts/AccountsService';
import { SettingsService } from '../../settings/SettingsService';
import { NetworkService } from '../../network/NetworkService';
import { KeystoneOnboardingHandler } from './keystoneOnboardingHandler';
import { buildRpcCall } from '@src/tests/test-utils';
import { addXPChainToFavoriteIfNeeded } from '../utils/addXPChainsToFavoriteIfNeeded';
import { buildExtendedPublicKey } from '../../secrets/utils';

jest.mock('../utils/addXPChainsToFavoriteIfNeeded');

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

const WALLET_ID = 'wallet-id';
describe('src/background/services/onboarding/handlers/keystoneOnboardingHandler.ts', () => {
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

  const accountMock = {
    id: '1',
  };

  const getHandler = () =>
    new KeystoneOnboardingHandler(
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
      method: ExtensionRequest.KEYSTONE_ONBOARDING_SUBMIT,
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

  it('sets up a keystone wallet with xpub correctly', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        xpub: 'xpub',
        xpubXP: '',
        password: 'password',
        analyticsConsent: false,
        masterFingerprint: 'masterFingerprint',
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
      extendedPublicKeys: [
        buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
      ],
      publicKeys: [],
      masterFingerprint: 'masterFingerprint',
      derivationPathSpec: DerivationPath.BIP44,
      secretType: SecretType.Keystone,
      name: undefined,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenCalledWith({
      walletId: WALLET_ID,
    });

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);

    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds,
    ).not.toHaveBeenCalled();

    expect(addXPChainToFavoriteIfNeeded).toHaveBeenCalledWith([accountMock]);
  });
});
