import {
  AVALANCHE_XP_TEST_NETWORK,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import { BalancesService } from './BalancesService';
import { AccountType } from '../accounts/models';
import BN from 'bn.js';
import { PrimaryNetworkAssetType } from '@avalabs/glacier-sdk';
import {
  NetworkTokenWithBalance,
  TokenType,
  TokenWithBalanceAVM,
  TokenWithBalancePVM,
} from './models';
import { decorateWithCaipId } from '@src/utils/caipConversion';

describe('src/background/services/balances/BalancesService.ts', () => {
  const balancesServiceEVMMock = {
    getBalances: jest.fn(),
    getServiceForProvider: jest.fn(),
  } as any;
  const balancesServiceBTCMock = {
    getBalances: jest.fn(),
    getServiceForProvider: jest.fn(),
  } as any;
  const balancesServicePVMMock = {
    getBalances: jest.fn(),
  } as any;
  const balancesServiceAVMMock = {
    getBalances: jest.fn(),
  } as any;
  const balanceServiceGlacierMock = {
    getBalances: jest.fn(),
  } as any;
  const glacierServiceMock = {
    isNetworkSupported: jest.fn(),
  } as any;

  const pchain = decorateWithCaipId({
    ...AVALANCHE_XP_TEST_NETWORK,
    vmName: NetworkVMType.PVM,
  });

  const xchain = decorateWithCaipId({
    ...AVALANCHE_XP_TEST_NETWORK,
    vmName: NetworkVMType.AVM,
  });

  const testChain = decorateWithCaipId({
    chainName: 'testChain',
    chainId: 123,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'testChainRpcUrl',
    explorerUrl: 'https://explorer.url',
    networkToken: {
      name: 'testChainName',
      symbol: 'TEST',
      description: 'testChainDescription',
      decimals: 10,
      logoUri: 'testChainTokenLogoUri.com',
    },
    logoUri: 'testChainLogoUri.com',
  });

  const account = {
    id: '123',
    name: 'account name',
    addressBTC: 'addressBTC',
    addressC: 'addressC',
    addressPVM: 'addressPVM',
    index: 0,
    type: AccountType.PRIMARY,
    walletId: 'walletId',
  };

  const pchainResult: TokenWithBalancePVM = {
    name: 'P-Chain avax',
    symbol: 'AVAX',
    description: 'description',
    decimals: 9,
    logoUri: 'logoUri.com',
    type: TokenType.NATIVE,
    balance: new BN(2),
    balanceUSD: 4,
    balanceDisplayValue: '2',
    balanceUsdDisplayValue: '4',
    priceUSD: 2,

    available: new BN(1),
    availableUSD: 2,
    availableDisplayValue: '1',
    availableUsdDisplayValue: '2',
    utxos: {
      unlockedUnstaked: [
        {
          assetId: 'assetId',
          name: 'assetName',
          symbol: 'AVAX',
          denomination: 9,
          type: PrimaryNetworkAssetType.SECP256K1,
          amount: '1000000000',
          utxoCount: 1,
        },
      ],
      unlockedStaked: [],
      lockedPlatform: [],
      lockedStakeable: [],
      lockedStaked: [],
      pendingStaked: [],
      atomicMemoryUnlocked: [],
      atomicMemoryLocked: [],
    },
    lockedStaked: 1,
    lockedStakeable: 0,
    lockedPlatform: 0,
    atomicMemoryLocked: 0,
    atomicMemoryUnlocked: 0,
    unlockedUnstaked: 0,
    unlockedStaked: 0,
    pendingStaked: 0,
  };

  const xchainResult: TokenWithBalanceAVM = {
    name: 'X-Chain avax',
    symbol: 'AVAX',
    description: 'description',
    decimals: 9,
    logoUri: 'logoUri.com',
    type: TokenType.NATIVE,
    balance: new BN(6),
    balanceUSD: 36,
    balanceDisplayValue: '6',
    balanceUsdDisplayValue: '36',
    priceUSD: 6,

    available: new BN(3),
    availableUSD: 18,
    availableDisplayValue: '3',
    availableUsdDisplayValue: '18',
    utxos: {
      locked: [
        {
          assetId: 'assetId',
          name: 'assetName',
          symbol: 'AVAX',
          denomination: 9,
          type: PrimaryNetworkAssetType.SECP256K1,
          amount: '3000000000',
          utxoCount: 1,
        },
      ],
      unlocked: [
        {
          assetId: 'assetId',
          name: 'assetName',
          symbol: 'AVAX',
          denomination: 9,
          type: PrimaryNetworkAssetType.SECP256K1,
          amount: '3000000000',
          utxoCount: 1,
        },
      ],
      atomicMemoryUnlocked: [],
      atomicMemoryLocked: [],
    },
    locked: 3,
    unlocked: 3,
    atomicMemoryLocked: 0,
    atomicMemoryUnlocked: 0,
  };

  const glcacierResult: Record<
    string,
    Record<string, NetworkTokenWithBalance>
  > = {
    ['networkId']: {
      ['accountAddress']: {
        name: 'asset name',
        symbol: 'TEST',
        description: 'description',
        decimals: 9,
        logoUri: 'logoUri.com',
        type: TokenType.NATIVE,
        balance: new BN(3),
        balanceUSD: 9,
        balanceDisplayValue: '3',
        balanceUsdDisplayValue: '9',
        priceUSD: 3,
      },
    },
  };

  const evmResult: Record<string, Record<string, NetworkTokenWithBalance>> = {
    ['networkId2']: {
      ['accountAddress2']: {
        name: 'asset name 2',
        symbol: 'TEST2',
        description: 'description2',
        decimals: 9,
        logoUri: 'logoUri2.com',
        type: TokenType.NATIVE,
        balance: new BN(4),
        balanceUSD: 16,
        balanceDisplayValue: '4',
        balanceUsdDisplayValue: '16',
        priceUSD: 4,
      },
    },
  };
  const btcResult: Record<string, Record<string, NetworkTokenWithBalance>> = {
    ['networkId3']: {
      ['accountAddress3']: {
        name: 'asset name 3',
        symbol: 'TEST3',
        description: 'description3',
        decimals: 9,
        logoUri: 'logoUri3.com',
        type: TokenType.NATIVE,
        balance: new BN(5),
        balanceUSD: 25,
        balanceDisplayValue: '5',
        balanceUsdDisplayValue: '25',
        priceUSD: 5,
      },
    },
  };

  let service: BalancesService;
  beforeEach(() => {
    jest.resetAllMocks();
    (balancesServiceEVMMock.getBalances as jest.Mock).mockResolvedValue(
      evmResult
    );
    (balancesServiceBTCMock.getBalances as jest.Mock).mockResolvedValue(
      btcResult
    );
    (balancesServicePVMMock.getBalances as jest.Mock).mockResolvedValue(
      pchainResult
    );
    (balancesServiceAVMMock.getBalances as jest.Mock).mockResolvedValue(
      xchainResult
    );
    (balanceServiceGlacierMock.getBalances as jest.Mock).mockResolvedValue(
      glcacierResult
    );
    (glacierServiceMock.isNetworkSupported as jest.Mock).mockResolvedValue(
      true
    );

    service = new BalancesService(
      balancesServiceEVMMock,
      balancesServiceBTCMock,
      balancesServicePVMMock,
      balancesServiceAVMMock,
      {} as any,
      balanceServiceGlacierMock,
      glacierServiceMock
    );
  });

  describe('getBalancesForNetwork', () => {
    it('should call getBalances using BalancesServicePVM when network is P-Chain', async () => {
      const result = await service.getBalancesForNetwork(pchain, [account]);

      expect(result).toEqual(pchainResult);
      expect(balancesServicePVMMock.getBalances).toHaveBeenCalled();
    });

    it('should call getBalances using BalancesServiceAVM when network is X-Chain', async () => {
      const result = await service.getBalancesForNetwork(xchain, [account]);

      expect(result).toEqual(xchainResult);
      expect(balancesServiceAVMMock.getBalances).toHaveBeenCalled();
    });

    it('should call getBalances using balanceServiceGlacier when network is supported by glacier', async () => {
      const result = await service.getBalancesForNetwork(testChain, [account]);

      expect(result).toEqual(glcacierResult);
      expect(glacierServiceMock.isNetworkSupported).toHaveBeenCalled();
      expect(balanceServiceGlacierMock.getBalances).toHaveBeenCalled();
    });

    it('should call getBalances using balancesServiceEVM when network is not supported by glacier', async () => {
      (glacierServiceMock.isNetworkSupported as jest.Mock).mockResolvedValue(
        false
      );
      (
        balancesServiceEVMMock.getServiceForProvider as jest.Mock
      ).mockReturnValue(balancesServiceEVMMock);
      const result = await service.getBalancesForNetwork(testChain, [account]);

      expect(result).toEqual(evmResult);
      expect(glacierServiceMock.isNetworkSupported).toHaveBeenCalled();
      expect(balancesServiceEVMMock.getBalances).toHaveBeenCalled();
    });
    it('should call getBalances using balancesServiceBTC when network is not supported by glacier', async () => {
      (glacierServiceMock.isNetworkSupported as jest.Mock).mockResolvedValue(
        false
      );
      (
        balancesServiceBTCMock.getServiceForProvider as jest.Mock
      ).mockReturnValue(balancesServiceBTCMock);
      const result = await service.getBalancesForNetwork(testChain, [account]);

      expect(result).toEqual(btcResult);
      expect(glacierServiceMock.isNetworkSupported).toHaveBeenCalled();
      expect(balancesServiceBTCMock.getBalances).toHaveBeenCalled();
    });
  });
});
