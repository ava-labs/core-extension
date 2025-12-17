import { finalizeOnboarding } from './finalizeOnboarding';
import { OnboardingService } from './OnboardingService';
import { LockService } from '../lock/LockService';
import { WalletService } from '../wallet/WalletService';
import { AccountsService } from '../accounts/AccountsService';
import { NetworkService } from '../network/NetworkService';
import { NETWORKS_ENABLED_BY_DEFAULT } from '@core/types';

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
describe('src/background/services/onboarding/finalizeOnboarding.test.ts', () => {
  const onboardingServiceMock = {
    setIsOnboarded: jest.fn(),
  } as unknown as OnboardingService;
  const lockServiceMock = {
    unlock: jest.fn(),
  } as unknown as LockService;
  const walletServiceMock = {
    init: jest.fn(),
  } as unknown as WalletService;
  const accountsServiceMock = {
    addPrimaryAccount: jest.fn(),
    getAccountList: jest.fn(),
    getAccounts: jest.fn(),
    activateAccount: jest.fn(),
  } as unknown as AccountsService;
  const networkServiceMock = {
    setNetwork: jest.fn(),
    enableNetwork: jest.fn(),
    getAvalancheNetwork: jest.fn(),
  } as unknown as NetworkService;

  const accountMock = {
    id: '1',
  };

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
  it('sets up an mnemonic wallet correctly', async () => {
    await finalizeOnboarding({
      walletId: WALLET_ID,
      networkService: networkServiceMock,
      accountsService: accountsServiceMock,
      onboardingService: onboardingServiceMock,
      lockService: lockServiceMock,
      password: 'password',
    });

    NETWORKS_ENABLED_BY_DEFAULT.forEach((chainId, index) => {
      expect(networkServiceMock.enableNetwork).toHaveBeenNthCalledWith(
        index + 1,
        chainId,
      );
    });
    expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith(
      accountMock.id,
    );
    expect(onboardingServiceMock.setIsOnboarded).toHaveBeenCalledWith(true);
    expect(lockServiceMock.unlock).toHaveBeenCalledWith('password');
  });
});
