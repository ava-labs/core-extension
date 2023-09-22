import Big from 'big.js';

import { AccountsService } from '../accounts/AccountsService';
import { AccountType } from '../accounts/models';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { NetworkService } from '../network/NetworkService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { StorageService } from '../storage/StorageService';
import { WalletService } from '../wallet/WalletService';

import { BridgeService } from './BridgeService';

jest.mock('@avalabs/bridge-sdk', () => {
  const { mockConfig } = require('./fixtures/mockBridgeConfig');

  return {
    ...jest.requireActual('@avalabs/bridge-sdk'),
    fetchConfig: jest.fn().mockResolvedValue({ config: mockConfig }),
  };
});

const storageService = {
  load: jest
    .fn()
    .mockResolvedValue({ bridgeTransactions: {}, isDevEnv: false }),
  save: jest.fn(),
} as unknown as StorageService;

const networkService = {
  isMainnet: jest.fn(),
  developerModeChanged: {
    add: jest.fn(),
  },
} as unknown as NetworkService;

const walletService = {
  sign: jest.fn(),
} as unknown as WalletService;

const featureFlagService = {
  ensureFlagEnabled: jest.fn(),
} as unknown as FeatureFlagService;

const networkFeeService = {
  getNetworksFee: jest.fn(),
} as unknown as NetworkFeeService;

const networkBalancesService = {
  balances: {},
} as unknown as BalanceAggregatorService;

describe('src/background/services/bridge/BridgeService.ts', () => {
  describe('when active account is a WalletConnect account', () => {
    const accountsService = {
      activeAccount: {
        addressC: '1234-abcd',
        type: AccountType.WALLET_CONNECT,
      },
    } as unknown as AccountsService;

    let service: BridgeService;

    beforeEach(async () => {
      service = new BridgeService(
        storageService,
        networkService,
        walletService,
        accountsService,
        featureFlagService,
        networkFeeService,
        networkBalancesService
      );
      await service.onStorageReady();
    });

    it('does not allow bridging BTC', async () => {
      await expect(
        service.transferBtcAsset(new Big(1000), 1234)
      ).rejects.toThrowError(
        'WalletConnect accounts are not supported by Bridge yet'
      );
    });
  });
});
