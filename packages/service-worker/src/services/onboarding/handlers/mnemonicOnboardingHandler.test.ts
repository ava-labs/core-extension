import {
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
  SecretType,
} from '@core/types';
import {
  Avalanche,
  DerivationPath,
  getXpubFromMnemonic,
} from '@avalabs/core-wallets-sdk';
import { MnemonicOnboardingHandler } from './mnemonicOnboardingHandler';
import { ExtensionRequest } from '@core/types';
import { OnboardingService } from '../OnboardingService';
import { StorageService } from '../../storage/StorageService';
import { LockService } from '../../lock/LockService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { WalletService } from '../../wallet/WalletService';
import { AccountsService } from '../../accounts/AccountsService';
import { SettingsService } from '../../settings/SettingsService';
import { NetworkService } from '../../network/NetworkService';
import { buildRpcCall } from '@shared/tests/test-utils';
import { buildExtendedPublicKey } from '../../secrets/utils';
import { addChainsToFavoriteIfNeeded } from '../utils/addChainsToFavoriteIfNeeded';

jest.mock('../utils/addChainsToFavoriteIfNeeded');

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
describe('src/background/services/onboarding/handlers/mnemonicOnboardingHandler.ts', () => {
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
  } as any;

  const getHandler = () =>
    new MnemonicOnboardingHandler(
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
      method: ExtensionRequest.MNEMONIC_ONBOARDING_SUBMIT,
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

  it('is not case sensitive', async () => {
    jest.mocked(getXpubFromMnemonic).mockResolvedValueOnce('xpubFromMnemonic');
    jest
      .mocked(Avalanche.getXpubFromMnemonic)
      .mockReturnValueOnce('xpubFromMnemonicXP');

    const mnemonic = 'MnEmOnIc';
    const handler = getHandler();
    const request = getRequest([
      {
        mnemonic,
        password: 'password',
        analyticsConsent: false,
      },
    ]);

    const result = await handler.handle(buildRpcCall(request));

    expect(walletServiceMock.init).toHaveBeenCalledWith(
      expect.objectContaining({
        mnemonic: mnemonic.toLowerCase(),
      }),
    );
    expect(getXpubFromMnemonic).toHaveBeenCalledWith(mnemonic.toLowerCase());
    expect(Avalanche.getXpubFromMnemonic).toHaveBeenCalledWith(
      mnemonic.toLowerCase(),
    );

    expect(result).toEqual({
      ...request,
      result: true,
    });
  });

  it.only('sets up an mnemonic wallet correctly', async () => {
    (getXpubFromMnemonic as jest.Mock).mockResolvedValueOnce(
      'xpubFromMnemonic',
    );
    (Avalanche.getXpubFromMnemonic as jest.Mock).mockReturnValueOnce(
      'xpubFromMnemonicXP',
    );

    const handler = getHandler();
    const request = getRequest([
      {
        mnemonic: 'mnemonic',
        password: 'password',
        analyticsConsent: false,
      },
    ]);

    const result = await handler.handle(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: true,
    });

    expect(getXpubFromMnemonic).toHaveBeenCalledWith('mnemonic');
    expect(storageServiceMock.createStorageKey).toHaveBeenCalledWith(
      'password',
    );
    expect(walletServiceMock.init).toHaveBeenCalledWith({
      mnemonic: 'mnemonic',
      extendedPublicKeys: [
        buildExtendedPublicKey('xpubFromMnemonic', EVM_BASE_DERIVATION_PATH),
        buildExtendedPublicKey(
          'xpubFromMnemonicXP',
          AVALANCHE_BASE_DERIVATION_PATH,
        ),
      ],
      publicKeys: [],
      derivationPathSpec: DerivationPath.BIP44,
      secretType: SecretType.Mnemonic,
      name: undefined,
    });

    expect(accountsServiceMock.addPrimaryAccount).toHaveBeenCalledWith({
      walletId: WALLET_ID,
      addAllWithHistory: true,
    });

    expect(settingsServiceMock.setAnalyticsConsent).toHaveBeenCalledWith(false);

    expect(
      analyticsServiceMock.saveTemporaryAnalyticsIds,
    ).not.toHaveBeenCalled();

    expect(addChainsToFavoriteIfNeeded).toHaveBeenCalledWith([accountMock]);
  });
});
