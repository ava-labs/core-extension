import {
  Blockchain,
  estimateGas,
  getBtcTransactionDetails,
} from '@avalabs/core-bridge-sdk';
import { BITCOIN_NETWORK, ChainId } from '@avalabs/core-chains-sdk';
import Big from 'big.js';

import type { AccountsService } from '../accounts/AccountsService';
import { AccountType } from '../accounts/models';
import type { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import type { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import type { NetworkService } from '../network/NetworkService';
import type { StorageService } from '../storage/StorageService';

import { BridgeService } from './BridgeService';

jest.mock('@avalabs/core-bridge-sdk', () => {
  const { mockConfig } = jest.requireActual('./fixtures/mockBridgeConfig');

  return {
    ...jest.requireActual('@avalabs/core-bridge-sdk'),
    getBtcTransactionDetails: jest.fn(),
    estimateGas: jest.fn(),
    fetchConfig: jest.fn().mockResolvedValue({ config: mockConfig }),
  };
});

jest.mock('@src/utils/network/getProviderForNetwork');

const storageService = {
  load: jest
    .fn()
    .mockResolvedValue({ bridgeTransactions: {}, isDevEnv: false }),
  save: jest.fn(),
} as unknown as StorageService;

const networkService = jest.mocked<NetworkService>({
  isMainnet: jest.fn(),
  developerModeChanged: {
    add: jest.fn(),
  },
  getBitcoinNetwork: jest.fn().mockReturnValue(BITCOIN_NETWORK),
  getProviderForNetwork: jest.fn(),
  getAvalancheProvider: jest.fn(),
  getEthereumProvider: jest.fn(),
} as any);

const featureFlagService = {
  ensureFlagEnabled: jest.fn(),
} as unknown as FeatureFlagService;

const addressBTC = 'tb01234';

const networkBalancesService = {
  getBalancesForNetworks: async () => ({
    tokens: {
      [ChainId.BITCOIN_TESTNET]: {
        [addressBTC]: {
          BTC: {},
        },
      },
    },
  }),
} as unknown as BalanceAggregatorService;

describe('src/background/services/bridge/BridgeService.ts', () => {
  describe('.estimateGas()', () => {
    const accountsService = {
      activeAccount: {
        addressC: '1234-abcd',
        addressBTC,
        type: AccountType.FIREBLOCKS,
      },
    } as unknown as AccountsService;

    let service: BridgeService;

    beforeEach(async () => {
      service = new BridgeService(
        storageService,
        networkService,
        accountsService,
        featureFlagService,
        networkBalancesService,
      );
      await service.onStorageReady();
    });

    describe('when bridging from Bitcoin', () => {
      beforeEach(() => {
        jest.mocked(getBtcTransactionDetails).mockReturnValue({
          inputs: [],
          outputs: [],
          fee: 10000,
        } as any);
      });

      it('uses byteLength as gas limit estimation', async () => {
        expect(
          await service.estimateGas(
            Blockchain.BITCOIN,
            new Big('1'),
            {} as any,
          ),
        ).toEqual(10000n);
      });
    });

    describe('when bridging from EVM', () => {
      it('uses estimateGas() util from the SDK', async () => {
        jest.mocked(estimateGas).mockResolvedValueOnce(12345n);

        const result = await service.estimateGas(
          Blockchain.ETHEREUM,
          new Big('1'),
          {} as any,
        );

        expect(estimateGas).toHaveBeenCalledWith(
          new Big('1'),
          accountsService.activeAccount?.addressC,
          {} as any,
          {
            ethereum: networkService.getEthereumProvider(),
            avalanche: networkService.getAvalancheProvider(),
          },
          service.bridgeConfig.config,
          Blockchain.ETHEREUM,
        );

        expect(result).toEqual(12345n);
      });
    });
  });
});
