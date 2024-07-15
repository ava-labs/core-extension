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
import { LedgerOnboardingHandler } from './ledgerOnboardingHandler';
import { SecretType } from '../../secrets/models';
import { buildRpcCall } from '@src/tests/test-utils';
import { addXPChainToFavoriteIfNeeded } from '../utils/addXPChainsToFavoriteIfNeeded';

jest.mock('../utils/addXPChainsToFavoriteIfNeeded');

const WALLET_ID = 'wallet-id';

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
    addFavoriteNetwork: jest.fn(),
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
      networkServiceMock
    );

  const getRequest = (params: unknown[]) =>
    ({
      id: '123',
      method: ExtensionRequest.LEDGER_ONBOARDING_SUBMIT,
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
  it('sets up a ledger wallet with xpub correctly', async () => {
    const handler = getHandler();
    const request = getRequest([
      {
        xpub: 'xpub',
        xpubXP: 'xpubXP',
        password: 'password',
        walletName: 'wallet-name',
        analyticsConsent: false,
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
      'password'
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      mnemonic: undefined,
      xpub: 'xpub',
      xpubXP: 'xpubXP',
      derivationPath: DerivationPath.BIP44,
      secretType: SecretType.Ledger,
      name: 'wallet-name',
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenCalledWith({
      walletId: WALLET_ID,
    });

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);

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
        walletName: 'wallet-name',
        analyticsConsent: false,
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
      'password'
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      pubKeys: ['pubkey1', 'pubkey2', 'pubkey3'],
      derivationPath: DerivationPath.LedgerLive,
      secretType: SecretType.LedgerLive,
      name: 'wallet-name',
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(1, {
      walletId: WALLET_ID,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(2, {
      walletId: WALLET_ID,
    });
    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenNthCalledWith(3, {
      walletId: WALLET_ID,
    });

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);

    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds
    ).not.toHaveBeenCalled();

    expect(addXPChainToFavoriteIfNeeded).toHaveBeenCalledWith([accountMock]);
  });
});
