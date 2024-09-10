import { BalancesService } from './BalancesService';
import { AccountType } from '../accounts/models';
import { PrimaryNetworkAssetType } from '@avalabs/glacier-sdk';
import { GetBalancesResponse, TokenType } from '@avalabs/vm-module-types';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import * as Sentry from '@sentry/browser';

jest.mock('@src/background/vmModules/ModuleManager');
jest.mock('@sentry/browser', () => {
  return {
    startTransaction: jest.fn(),
  };
});

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
          lockedStaked: 1,
          lockedStakeable: 0,
          lockedPlatform: 0,
          atomicMemoryLocked: 0,
          atomicMemoryUnlocked: 0,
          unlockedUnstaked: 0,
          unlockedStaked: 0,
          pendingStaked: 0,
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
          locked: 3,
          unlocked: 3,
          atomicMemoryLocked: 0,
          atomicMemoryUnlocked: 0,
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
  };
  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(Sentry.startTransaction).mockReturnValue({
      finish: jest.fn(),
    } as any);
    moduleManager = new ModuleManager({} as any);
    jest
      .mocked(moduleManager)
      .loadModuleByNetwork.mockResolvedValue(moduleMock as any);

    service = new BalancesService(
      {
        getSettings: jest.fn().mockResolvedValue({ currency: 'EUR' }),
      } as any,
      moduleManager
    );
  });

  describe('getBalancesForNetwork', () => {
    it('should get balances for P-Chain', async () => {
      moduleMock.getBalances.mockResolvedValue(pvmResult);
      const network = { vmName: NetworkVMType.PVM, caipId: 'pvm' };
      const result = await service.getBalancesForNetwork(network as any, [
        account,
      ]);

      expect(result).toEqual({
        ['networkId2']: {
          ['addressPVM']: {
            ...pvmResult['networkId2']?.['addressPVM'],
            priceChanges: {
              percentage: undefined,
              value: 0,
            },
          },
        },
      });
      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressPVM'],
        currency: 'eur',
        network,
      });
    });

    it('should get balances for X-Chain', async () => {
      moduleMock.getBalances.mockResolvedValue(avmResult);
      const network = { vmName: NetworkVMType.AVM, caipId: 'avm' } as any;
      const result = await service.getBalancesForNetwork(network, [account]);

      expect(result).toEqual({
        ['networkId2']: {
          ['addressAVM']: {
            ...avmResult['networkId2']?.['addressAVM'],
            priceChanges: {
              percentage: undefined,
              value: 0,
            },
          },
        },
      });
      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressAVM'],
        currency: 'eur',
        network,
      });
    });

    it('should get balances for EVM', async () => {
      moduleMock.getBalances.mockResolvedValue(evmResult);
      const network = { vmName: NetworkVMType.EVM, caipId: 'evm' } as any;
      const result = await service.getBalancesForNetwork(network, [account]);

      expect(result).toEqual({
        ['networkId2']: {
          ['addressC']: {
            ...evmResult['networkId2']?.['addressC'],
            priceChanges: {
              percentage: undefined,
              value: 0,
            },
          },
        },
      });

      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressC'],
        currency: 'eur',
        network,
      });
    });

    it('should get balances for Bitcoin', async () => {
      moduleMock.getBalances.mockResolvedValue(btcResult);
      const network = { vmName: NetworkVMType.BITCOIN, caipId: 'btc' } as any;
      const result = await service.getBalancesForNetwork(network, [account]);

      expect(result).toEqual({
        ['networkId3']: {
          ['addressBTC']: {
            ...btcResult['networkId3']?.['addressBTC'],
            priceChanges: {
              percentage: undefined,
              value: 0,
            },
          },
        },
      });

      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressBTC'],
        currency: 'eur',
        network,
      });
    });

    it('should calculate price changes if provided', async () => {
      moduleMock.getBalances.mockResolvedValue(evmResult);
      const network = { vmName: NetworkVMType.EVM, caipId: 'evm' } as any;
      const result = await service.getBalancesForNetwork(network, [account], {
        test2: { priceChangePercentage: 25 },
      });

      expect(result).toEqual({
        ['networkId2']: {
          ['addressC']: {
            ...evmResult['networkId2']?.['addressC'],
            priceChanges: {
              percentage: 25,
              value: 4,
            },
          },
        },
      });

      expect(moduleMock.getBalances).toHaveBeenCalledTimes(1);
      expect(moduleMock.getBalances).toHaveBeenCalledWith({
        addresses: ['addressC'],
        currency: 'eur',
        network,
      });
    });
  });
});
