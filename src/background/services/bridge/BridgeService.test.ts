import { getBtcTransaction } from '@avalabs/bridge-sdk';
import { BITCOIN_NETWORK, ChainId } from '@avalabs/chains-sdk';
import { BlockCypherProvider } from '@avalabs/wallets-sdk';
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
import { CommonError } from '@src/utils/errors';
import { FireblocksErrorCode } from '../fireblocks/models';
import { ethErrors } from 'eth-rpc-errors';

jest.mock('@avalabs/bridge-sdk', () => {
  const { mockConfig } = require('./fixtures/mockBridgeConfig');

  return {
    ...jest.requireActual('@avalabs/bridge-sdk'),
    getBtcTransaction: jest.fn(),
    fetchConfig: jest.fn().mockResolvedValue({ config: mockConfig }),
  };
});

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
} as any);

const walletService = jest.mocked<WalletService>({
  sign: jest.fn(),
} as any);

const featureFlagService = {
  ensureFlagEnabled: jest.fn(),
} as unknown as FeatureFlagService;

const networkFeeService = jest.mocked<NetworkFeeService>({
  getNetworkFee: jest.fn(),
} as any);

const addressBTC = 'tb01234';

const networkBalancesService = {
  balances: {
    [ChainId.BITCOIN_TESTNET]: {
      [addressBTC]: {
        BTC: {},
      },
    },
  },
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

  describe('when transaction signing fails', () => {
    const accountsService = {
      activeAccount: {
        addressC: '1234-abcd',
        addressBTC,
        type: AccountType.PRIMARY,
      },
    } as unknown as AccountsService;

    let service: BridgeService;

    beforeEach(async () => {
      jest.mocked(getBtcTransaction).mockReturnValue({
        inputs: [],
        outputs: [],
      } as any);

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

    it('propagates recognized errors', async () => {
      walletService.sign.mockRejectedValueOnce(
        ethErrors.rpc.transactionRejected({
          data: { reason: FireblocksErrorCode.Blocked },
        })
      );

      await expect(
        service.transferBtcAsset(new Big(1000), 1234)
      ).rejects.toThrowError(
        ethErrors.rpc.transactionRejected({
          data: { reason: FireblocksErrorCode.Blocked },
        })
      );
    });

    it('defaults to unknown error if original exception is not recognized', async () => {
      walletService.sign.mockRejectedValueOnce(new Error('what is dis'));

      await expect(
        service.transferBtcAsset(new Big(1000), 1234)
      ).rejects.toThrowError(
        ethErrors.rpc.internal({ data: { reason: CommonError.Unknown } })
      );
    });
  });

  describe('when a signed tx is received from WalletService', () => {
    const accountsService = {
      activeAccount: {
        addressC: '1234-abcd',
        addressBTC,
        type: AccountType.FIREBLOCKS,
      },
    } as unknown as AccountsService;

    const maxFee = 123n;
    const txIssueResult = {
      hash: '0xHASH',
      fees: 123,
      confirmations: 1,
    };

    const provider = {
      issueRawTx: jest.fn().mockResolvedValue(txIssueResult),
    } as unknown as BlockCypherProvider;

    const signedTx = '0x1234567890';

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

      networkFeeService.getNetworkFee.mockResolvedValue({
        high: { maxFee },
      } as any);

      networkService.getProviderForNetwork.mockReturnValue(provider);

      jest.mocked(getBtcTransaction).mockReturnValue({
        inputs: [],
        outputs: [],
      } as any);

      walletService.sign.mockResolvedValue({ signedTx });
    });

    it('issues the transaction and returns its details', async () => {
      const { hash, confirmations, from, gasLimit, value } =
        await service.transferBtcAsset(new Big(0.0001), 1234);

      expect(provider.issueRawTx).toHaveBeenCalledWith(signedTx);

      expect({ hash, confirmations, from }).toStrictEqual({
        hash: txIssueResult.hash,
        confirmations: txIssueResult.confirmations,
        from: addressBTC,
      });
      // We need to compare gasLimit & value outside of the object
      // and as regular numbers, otherwise Jest is trying to serialize
      // the BigInts and fails.
      // Reference: https://github.com/jestjs/jest/issues/11617
      expect(Number(gasLimit)).toEqual(txIssueResult.fees);
      expect(Number(value)).toEqual(10000);
    });
  });

  describe('when a tx hash is received from WalletService', () => {
    const accountsService = {
      activeAccount: {
        addressC: '1234-abcd',
        addressBTC,
        type: AccountType.FIREBLOCKS,
      },
    } as unknown as AccountsService;

    const maxFee = 123n;
    const txLookupResult = {
      hash: '0xHASH',
      fees: 123,
      confirmations: 1,
    };

    const blockcypherMock = {
      waitForTx: jest.fn().mockResolvedValue(txLookupResult),
    };
    const provider = {
      getBlockCypher: () => blockcypherMock,
    } as unknown as BlockCypherProvider;

    const txHash = '0x1234567890';

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

      networkFeeService.getNetworkFee.mockResolvedValue({
        high: { maxFee },
      } as any);

      networkService.getProviderForNetwork.mockReturnValue(provider);

      jest.mocked(getBtcTransaction).mockReturnValue({
        inputs: [],
        outputs: [],
      } as any);

      walletService.sign.mockResolvedValue({ txHash });
    });

    it('looks up the transaction details on the blockchain and returns them', async () => {
      const { hash, confirmations, from, gasLimit, value } =
        await service.transferBtcAsset(new Big(0.0001), 1234);

      expect(blockcypherMock.waitForTx).toHaveBeenCalledWith(txHash);

      expect({ hash, confirmations, from }).toStrictEqual({
        hash: txLookupResult.hash,
        confirmations: txLookupResult.confirmations,
        from: addressBTC,
      });
      // We need to compare gasLimit & value outside of the object
      // and as regular numbers, otherwise Jest is trying to serialize
      // the BigInts and fails.
      // Reference: https://github.com/jestjs/jest/issues/11617
      expect(Number(gasLimit)).toEqual(txLookupResult.fees);
      expect(Number(value)).toEqual(10000);
    });
  });
});
