import { ChainId } from '@avalabs/chains-sdk';
import { finalizeOnboarding } from './finalizeOnboarding';
import { OnboardingService } from './OnboardingService';
import { LockService } from '../lock/LockService';
import { WalletService } from '../wallet/WalletService';
import { AccountsService } from '../accounts/AccountsService';
import { NetworkService } from '../network/NetworkService';

jest.mock('@avalabs/wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/wallets-sdk'),
  getXpubFromMnemonic: jest.fn(),
  Avalanche: {
    getXpubFromMnemonic: jest.fn(),
  },
}));

const WALLET_ID = 'wallet-id';
describe('src/background/services/onboarding/handlers/onboardingInitalWork.ts', () => {
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
    activateAccount: jest.fn(),
  } as unknown as AccountsService;
  const networkServiceMock = {
    addFavoriteNetwork: jest.fn(),
  } as unknown as NetworkService;

  const accountMock = {
    id: '1',
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (accountsServiceMock.getAccountList as jest.Mock).mockReturnValue([
      accountMock,
    ]);
    (walletServiceMock.init as jest.Mock).mockResolvedValue(WALLET_ID);
  });
  it('sets up an mnemonic wallet correctly', async () => {
    await finalizeOnboarding({
      networkService: networkServiceMock,
      accountsService: accountsServiceMock,
      onboardingService: onboardingServiceMock,
      lockService: lockServiceMock,
      password: 'password',
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
    expect(lockServiceMock.unlock).toHaveBeenCalledWith('password');
  });
});