import { BalancesService } from './BalancesService';
import { AccountType } from '@core/types';
import { PrimaryNetworkAssetType } from '@avalabs/glacier-sdk';
import { GetBalancesResponse, TokenType } from '@avalabs/vm-module-types';
import { ModuleManager } from '~/vmModules/ModuleManager';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import * as Sentry from '@sentry/browser';
import { getProviderForNetwork } from '@core/common';
import { SettingsService } from '../settings/SettingsService';
import LRUCache from 'lru-cache';
import { ethers } from 'ethers';

jest.mock('~/vmModules/ModuleManager');
jest.mock('@sentry/browser', () => {
  return {
    startTransaction: jest.fn(),
  };
});
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getProviderForNetwork: jest.fn(),
}));

describe('src/background/services/balances/BalancesService.ts', () => {
  const account = {
    id: '123',
    name: 'account name',
    addressBTC: 'addressBTC',
    addressC: 'addressC',
    addressPVM: 'addressPVM',
    addressAVM: 'addressAVM',
    index: 0,
    type: AccountType.PRIMARY,
    walletId: 'walletId',
  };

  const pvmResult: GetBalancesResponse = {
    ['networkId2']: {
      ['addressPVM']: {
        name: 'P-Chain avax',
        symbol: 'AVAX',
        description: 'description',
        decimals: 9,
        logoUri: 'logoUri.com',
        type: TokenType.NATIVE,
        balance: 2n,
        balanceInCurrency: 4,
        balanceDisplayValue: '2',
        balanceCurrencyDisplayValue: '4',
        priceInCurrency: 2,
        coingeckoId: '',

        available: 1n,
        availableInCurrency: 2,
        availableDisplayValue: '1',
        availableCurrencyDisplayValue: '2',
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
        balancePerType: {
          lockedStaked: 1n,
          lockedStakeable: 0n,
          lockedPlatform: 0n,
          atomicMemoryLocked: 0n,
          atomicMemoryUnlocked: 0n,
          unlockedUnstaked: 0n,
          unlockedStaked: 0n,
          pendingStaked: 0n,
        },
      },
    },
  };

  const avmResult: GetBalancesResponse = {
    ['networkId2']: {
      ['addressAVM']: {
        name: 'X-Chain avax',
        symbol: 'AVAX',
        description: 'description',
        decimals: 9,
        logoUri: 'logoUri.com',
        type: TokenType.NATIVE,
        balance: 6n,
        balanceInCurrency: 36,
        balanceDisplayValue: '6',
        balanceCurrencyDisplayValue: '36',
        priceInCurrency: 6,
        coingeckoId: '',

        available: 3n,
        availableInCurrency: 18,
        availableDisplayValue: '3',
        availableCurrencyDisplayValue: '18',
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

        balancePerType: {
          locked: 3n,
          unlocked: 3n,
          atomicMemoryLocked: 0n,
          atomicMemoryUnlocked: 0n,
        },
      },
    },
  };

  const evmResult: GetBalancesResponse = {
    ['networkId2']: {
      ['addressC']: {
        name: 'asset name 2',
        symbol: 'TEST2',
        description: 'description2',
        decimals: 9,
        logoUri: 'logoUri2.com',
        coingeckoId: '',
        type: TokenType.NATIVE,
        balance: 4n,
        balanceInCurrency: 16,
        balanceDisplayValue: '4',
        balanceCurrencyDisplayValue: '16',
        priceInCurrency: 4,
      },
    },
  };

  const btcResult: GetBalancesResponse = {
    ['networkId3']: {
      ['addressBTC']: {
        name: 'asset name 3',
        symbol: 'TEST3',
        description: 'description3',
        decimals: 9,
        logoUri: 'logoUri3.com',
        coingeckoId: '',
        type: TokenType.NATIVE,
        balance: 5n,
        balanceInCurrency: 25,
        balanceDisplayValue: '5',
        balanceCurrencyDisplayValue: '25',
        priceInCurrency: 5,
      },
    },
  };

  let service: BalancesService;
  let moduleManager: ModuleManager;
  const moduleMock = {
    getBalances: jest.fn(),
    getTokens: jest.fn(),
  };
  const settingsService: SettingsService = {
    getSettings: jest.fn(),
  } as any;
  const addressResolver = {
    getXPAddressesForAccountIndex: jest.fn(),
  } as any;
  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(Sentry.startTransaction).mockReturnValue({
      finish: jest.fn(),
    } as any);
    moduleManager = new ModuleManager({} as any);
    jest
      .mocked(moduleManager)
      .loadModuleByNetwork.mockResolvedValue(moduleMock as any);

    jest
      .mocked(settingsService.getSettings)
      .mockResolvedValue({ currency: 'EUR', customTokens: {} } as any);

    jest
      .mocked(addressResolver.getXPAddressesForAccountIndex)
      .mockResolvedValue({
        externalAddresses: [],
        internalAddresses: [],
      });
    service = new BalancesService(
      settingsService,
      moduleManager,
      addressResolver,
    );
  });

  describe('getBalancesForNetwork', () => {
    it('should get balances for P-Chain', async () => {
      moduleMock.getBalances.mockResolvedValue(pvmResult);
      const network = { vmName: NetworkVMType.PVM, caipId: 'pvm' };
      const result = await service.getBalancesForNetwork(
        network as any,
        [account],
        [],
      );

      expect(result).toEqual({
        ['networkId2']: {
          ['addressPVM']: {
            ...pvmResult['networkId2']?.['addressPVM'],
            priceChanges: {
              percentage: undefined,
              value: 0,
              currentPrice: undefined,
            },
          },
        },
      });
      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressPVM'],
        currency: 'eur',
        network,
        customTokens: [],
        tokenTypes: [],
        storage: expect.any(LRUCache),
      });
    });

    it('should get balances for X-Chain', async () => {
      moduleMock.getBalances.mockResolvedValue(avmResult);
      const network = { vmName: NetworkVMType.AVM, caipId: 'avm' } as any;
      const result = await service.getBalancesForNetwork(
        network,
        [account],
        [],
      );

      expect(result).toEqual({
        ['networkId2']: {
          ['addressAVM']: {
            ...avmResult['networkId2']?.['addressAVM'],
            priceChanges: {
              percentage: undefined,
              value: 0,
              currentPrice: undefined,
            },
          },
        },
      });
      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressAVM'],
        currency: 'eur',
        network,
        customTokens: [],
        tokenTypes: [],
        storage: expect.any(LRUCache),
      });
    });

    it('should get balances for EVM', async () => {
      const customToken = {
        address: 'tokenAddress',
        contractType: 'ERC-20',
        decimals: 18,
        name: 'Custom Test Token',
        symbol: 'CTT',
      } as const;

      moduleMock.getBalances.mockResolvedValue(evmResult);

      jest.mocked(settingsService.getSettings).mockResolvedValueOnce({
        currency: 'USD',
        customTokens: {
          '1337': {
            [customToken.address]: customToken,
          },
        },
      } as any);

      const network = {
        vmName: NetworkVMType.EVM,
        caipId: 'eip155:1337',
        chainId: 1337,
      } as any;
      const result = await service.getBalancesForNetwork(
        network,
        [account],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(result).toEqual({
        ['networkId2']: {
          ['addressC']: {
            ...evmResult['networkId2']?.['addressC'],
            priceChanges: {
              percentage: undefined,
              value: 0,
              currentPrice: undefined,
            },
          },
        },
      });

      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressC'],
        currency: 'usd',
        network,
        customTokens: [{ ...customToken, type: TokenType.ERC20 }],
        tokenTypes: [TokenType.NATIVE, TokenType.ERC20],
        storage: expect.any(LRUCache),
      });
    });

    it('should get balances for Bitcoin', async () => {
      moduleMock.getBalances.mockResolvedValue(btcResult);
      const network = { vmName: NetworkVMType.BITCOIN, caipId: 'btc' } as any;
      const result = await service.getBalancesForNetwork(
        network,
        [account],
        [],
      );

      expect(result).toEqual({
        ['networkId3']: {
          ['addressBTC']: {
            ...btcResult['networkId3']?.['addressBTC'],
            priceChanges: {
              percentage: undefined,
              value: 0,
              currentPrice: undefined,
            },
          },
        },
      });

      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressBTC'],
        currency: 'eur',
        network,
        customTokens: [],
        tokenTypes: [],
        storage: expect.any(LRUCache),
      });
    });

    it('should calculate price changes if provided', async () => {
      moduleMock.getBalances.mockResolvedValue(evmResult);
      const network = { vmName: NetworkVMType.EVM, caipId: 'evm' } as any;
      const result = await service.getBalancesForNetwork(
        network,
        [account],
        [],
        {
          test2: {
            internalId: 'test2',
            symbol: 'TEST2',
            platforms: {
              evm: 'addressC',
            },
            priceChangePercentage: 25,
            currentPrice: 5,
          },
        },
      );

      expect(result).toEqual({
        ['networkId2']: {
          ['addressC']: {
            ...evmResult['networkId2']?.['addressC'],
            priceChanges: {
              percentage: 25,
              value: 4,
              currentPrice: 5,
            },
          },
        },
      });

      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressC'],
        currency: 'eur',
        network,
        customTokens: [],
        tokenTypes: [],
        storage: expect.any(LRUCache),
      });
    });
  });

  describe('ERC20 testnet fallback', () => {
    const sepoliaNetwork = {
      vmName: NetworkVMType.EVM,
      caipId: 'eip155:11155111',
      chainId: 11155111,
      isTestnet: true,
    } as any;

    const makeNativeOnlyResult = (): GetBalancesResponse => ({
      addressC: {
        ETH: {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
          type: TokenType.NATIVE,
          balance: 1000000000000000000n,
          balanceInCurrency: 2000,
          balanceDisplayValue: '1.0',
          balanceCurrencyDisplayValue: '2000',
          priceInCurrency: 2000,
          coingeckoId: 'ethereum',
        },
      },
    });

    const mockTokenList = [
      { address: '0xToken1', name: 'USDC', symbol: 'USDC', decimals: 6 },
      { address: '0xToken2', name: 'LINK', symbol: 'LINK', decimals: 18 },
    ];

    const mockBalanceOf = jest.fn();
    const mockProvider = Object.create(
      (jest.requireActual('@avalabs/core-wallets-sdk') as any)
        .JsonRpcBatchInternal.prototype,
    );

    beforeEach(() => {
      jest.mocked(getProviderForNetwork).mockResolvedValue(mockProvider as any);
      moduleMock.getTokens.mockResolvedValue(mockTokenList);
      mockBalanceOf.mockResolvedValue(5000000n);
      jest.spyOn(ethers, 'Contract').mockImplementation(
        () =>
          ({
            balanceOf: mockBalanceOf,
          }) as any,
      );
    });

    it('should fetch ERC20 balances via RPC when module returns only native', async () => {
      moduleMock.getBalances.mockResolvedValue(makeNativeOnlyResult());

      const result = await service.getBalancesForNetwork(
        sepoliaNetwork,
        [account],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(moduleMock.getTokens).toHaveBeenCalled();
      expect(getProviderForNetwork).toHaveBeenCalled();
      expect(mockBalanceOf).toHaveBeenCalledWith('addressC');

      expect(result.addressC).toBeDefined();
      expect(result.addressC?.['0xtoken1']).toEqual(
        expect.objectContaining({
          type: TokenType.ERC20,
          symbol: 'USDC',
          balance: 5000000n,
        }),
      );
      expect(result.addressC?.['0xtoken2']).toEqual(
        expect.objectContaining({
          type: TokenType.ERC20,
          symbol: 'LINK',
          balance: 5000000n,
        }),
      );
    });

    it('should skip fallback when ERC20 tokens are already present', async () => {
      const resultWithErc20: GetBalancesResponse = {
        addressC: {
          ETH: (makeNativeOnlyResult().addressC as Record<string, any>).ETH,
          '0xexisting': {
            type: TokenType.ERC20,
            address: '0xExisting',
            name: 'Existing',
            symbol: 'EXT',
            decimals: 18,
            balance: 100n,
            balanceDisplayValue: '0.0000000000000001',
            balanceInCurrency: 0,
            balanceCurrencyDisplayValue: '0',
            priceInCurrency: 0,
            reputation: null,
          } as any,
        },
      };

      moduleMock.getBalances.mockResolvedValue(resultWithErc20);

      await service.getBalancesForNetwork(
        sepoliaNetwork,
        [account],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(moduleMock.getTokens).not.toHaveBeenCalled();
      expect(getProviderForNetwork).not.toHaveBeenCalled();
    });

    it('should not run fallback for mainnet EVM networks', async () => {
      const mainnetNetwork = {
        vmName: NetworkVMType.EVM,
        caipId: 'eip155:1',
        chainId: 1,
        isTestnet: false,
      } as any;

      moduleMock.getBalances.mockResolvedValue(makeNativeOnlyResult());

      await service.getBalancesForNetwork(
        mainnetNetwork,
        [account],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(moduleMock.getTokens).not.toHaveBeenCalled();
    });

    it('should not run fallback when ERC20 is not in tokenTypes', async () => {
      moduleMock.getBalances.mockResolvedValue(makeNativeOnlyResult());

      await service.getBalancesForNetwork(
        sepoliaNetwork,
        [account],
        [TokenType.NATIVE],
      );

      expect(moduleMock.getTokens).not.toHaveBeenCalled();
    });

    it('should handle token list with invalid entries gracefully', async () => {
      moduleMock.getTokens.mockResolvedValue([
        { address: '0xValid', name: 'Valid', symbol: 'VLD', decimals: 18 },
        { address: 123, name: 'Bad', symbol: 'BAD' },
        { name: 'NoAddr', symbol: 'NA', decimals: 18 },
      ]);
      moduleMock.getBalances.mockResolvedValue(makeNativeOnlyResult());

      const result = await service.getBalancesForNetwork(
        sepoliaNetwork,
        [account],
        [TokenType.NATIVE, TokenType.ERC20],
      );

      expect(result.addressC?.['0xvalid']).toBeDefined();
      expect(Object.keys(result.addressC ?? {}).length).toBe(2);
    });
  });
});
