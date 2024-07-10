import {
  Blockchain,
  estimateGas,
  getBtcTransactionDetails,
} from '@avalabs/bridge-sdk';
import { BITCOIN_NETWORK, ChainId } from '@avalabs/chains-sdk';
import { BitcoinProvider } from '@avalabs/wallets-sdk';
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
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

jest.mock('@avalabs/bridge-sdk', () => {
  const { mockConfig } = require('./fixtures/mockBridgeConfig');

  return {
    ...jest.requireActual('@avalabs/bridge-sdk'),
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
  getBalancesForNetworks: async () => ({
    [ChainId.BITCOIN_TESTNET]: {
      [addressBTC]: {
        BTC: {},
      },
    },
  }),
} as unknown as BalanceAggregatorService;

const utxos = [{ index: 1 }, { index: 2 }];
const utxosWithScript = [
  { index: 1, script: 'script1' },
  { index: 2, script: 'script2' },
];

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
        service.transferBtcAsset(new Big(1000), undefined, 1234)
      ).rejects.toThrow(
        'WalletConnect accounts are not supported by Bridge yet'
      );
    });
  });

  describe('when transaction signing fails', () => {
    const provider = {
      getScriptsForUtxos: jest.fn().mockResolvedValue([]),
    } as unknown as BitcoinProvider;

    const accountsService = {
      activeAccount: {
        addressC: '1234-abcd',
        addressBTC,
        type: AccountType.PRIMARY,
      },
    } as unknown as AccountsService;

    let service: BridgeService;

    beforeEach(async () => {
      jest.mocked(getBtcTransactionDetails).mockReturnValue({
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

      jest.mocked(getProviderForNetwork).mockReturnValue(provider);

      await service.onStorageReady();
    });

    it('propagates recognized errors', async () => {
      walletService.sign.mockRejectedValueOnce(
        ethErrors.rpc.transactionRejected({
          data: { reason: FireblocksErrorCode.Blocked },
        })
      );

      await expect(
        service.transferBtcAsset(new Big(1000), undefined, 1234)
      ).rejects.toThrow(
        ethErrors.rpc.transactionRejected({
          data: { reason: FireblocksErrorCode.Blocked },
        })
      );
    });

    it('defaults to unknown error if original exception is not recognized', async () => {
      walletService.sign.mockRejectedValueOnce(new Error('what is dis'));

      await expect(
        service.transferBtcAsset(new Big(1000), undefined, 1234)
      ).rejects.toThrow(
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
      issueRawTx: jest.fn().mockResolvedValue(txIssueResult.hash),
      getScriptsForUtxos: jest.fn().mockResolvedValue(utxosWithScript),
      waitForTx: jest.fn().mockResolvedValue(txIssueResult),
    } as unknown as BitcoinProvider;

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

      jest.mocked(getProviderForNetwork).mockReturnValue(provider);

      jest.mocked(getBtcTransactionDetails).mockReturnValue({
        inputs: utxos,
        outputs: [],
      } as any);

      walletService.sign.mockResolvedValue({ signedTx });
    });

    it('issues the transaction and returns its details', async () => {
      const { hash, confirmations, from, gasLimit, value } =
        await service.transferBtcAsset(new Big(0.0001), undefined, 1234);

      expect(provider.getScriptsForUtxos).toHaveBeenCalledWith(utxos);
      expect(provider.issueRawTx).toHaveBeenCalledWith(signedTx);
      expect(provider.waitForTx).toHaveBeenCalledWith(txIssueResult.hash);

      expect(walletService.sign).toHaveBeenCalledWith(
        {
          inputs: utxosWithScript,
          outputs: [],
        },
        BITCOIN_NETWORK,
        1234
      );

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

    const provider = {
      getScriptsForUtxos: jest.fn().mockResolvedValue(utxosWithScript),
      waitForTx: jest.fn().mockResolvedValue(txLookupResult),
    } as unknown as BitcoinProvider;

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

      jest.mocked(getProviderForNetwork).mockReturnValue(provider);

      jest.mocked(getBtcTransactionDetails).mockReturnValue({
        inputs: [],
        outputs: [],
      } as any);

      walletService.sign.mockResolvedValue({ txHash });
    });

    it('looks up the transaction details on the blockchain and returns them', async () => {
      const { hash, confirmations, from, gasLimit, value } =
        await service.transferBtcAsset(new Big(0.0001), undefined, 1234);

      expect(provider.waitForTx).toHaveBeenCalledWith(txHash);

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
        walletService,
        accountsService,
        featureFlagService,
        networkFeeService,
        networkBalancesService
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
          await service.estimateGas(Blockchain.BITCOIN, new Big('1'), {} as any)
        ).toEqual(10000n);
      });
    });

    describe('when bridging from EVM', () => {
      it('uses estimateGas() util from the SDK', async () => {
        jest.mocked(estimateGas).mockResolvedValueOnce(12345n);

        const result = await service.estimateGas(
          Blockchain.ETHEREUM,
          new Big('1'),
          {} as any
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
          Blockchain.ETHEREUM
        );

        expect(result).toEqual(12345n);
      });
    });
  });
});
