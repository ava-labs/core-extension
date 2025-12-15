import { ChainId } from '@avalabs/core-chains-sdk';
import { providerErrors, rpcErrors } from '@metamask/rpc-errors';
import { DappInfo, DetailItemType, RpcMethod } from '@avalabs/vm-module-types';
import { BitcoinSendTransactionParams } from '@avalabs/bitcoin-module';

import { chainIdToCaip, getProviderForNetwork } from '@core/common';

import { WalletService } from '../services/wallet/WalletService';
import { NetworkService } from '../services/network/NetworkService';
import { TransactionStatusEvents } from '../services/transactions/events/transactionStatusEvents';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';

import {
  ApprovalParamsWithContext,
  MultiApprovalParamsWithContext,
} from './models';
import { ApprovalController } from './ApprovalController';
import {
  Action,
  ActionStatus,
  ActionType,
  MultiTxAction,
  ACTION_HANDLED_BY_MODULE,
} from '@core/types';
import { SecretsService } from '../services/secrets/SecretsService';

jest.mock('tsyringe', () => {
  return {
    ...jest.requireActual('tsyringe'),
    container: {
      resolve: jest.fn(),
    },
  };
});
jest.mock('~/runtime/openApprovalWindow');
jest.mock('@core/common');

const btcNetwork = {
  chainId: ChainId.BITCOIN_TESTNET,
  rpcUrl: '',
} as any;

const cChain = {
  chainId: ChainId.AVALANCHE_MAINNET_ID,
  rpcUrl: '',
} as any;

const dappInfo: DappInfo = {
  icon: 'icon',
  name: 'name',
  url: 'https://extension.url',
};

const actionId = crypto.randomUUID();
const getExpectedAction = (params) => ({
  [ACTION_HANDLED_BY_MODULE]: true,
  actionId,
  caipId: params.request.chainId,
  dappInfo: params.request.dappInfo,
  signingData: params.signingData,
  signingRequests: params.signingRequests,
  context: params.request.context,
  status: ActionStatus.PENDING,
  tabId: params.request.context?.tabId,
  params: params.request.params,
  displayData: params.displayData,
  scope: params.request.chainId,
  id: params.request.requestId,
  method: params.request.method,
});

describe('src/background/vmModules/ApprovalController', () => {
  const params: BitcoinSendTransactionParams = {
    amount: 100_000_000,
    feeRate: 50,
    from: 'from',
    to: 'to',
  };

  const approvalParams: ApprovalParamsWithContext = {
    request: {
      chainId: chainIdToCaip(btcNetwork.chainId),
      method: RpcMethod.BITCOIN_SEND_TRANSACTION,
      requestId: 'requestId',
      sessionId: 'sessionId',
      dappInfo,
      context: {
        tabId: 1234,
      },
      params,
    },
    displayData: {
      details: [
        {
          title: 'Transaction Details',
          items: [
            {
              label: 'From',
              type: DetailItemType.ADDRESS,
              value: params.from,
            },
          ],
        },
      ],
      network: btcNetwork,
      title: 'Approve Transaction',
      networkFeeSelector: true,
    },
    signingData: {
      account: params.from,
      type: RpcMethod.BITCOIN_SEND_TRANSACTION,
      data: {
        amount: params.amount,
        balance: {} as any,
        gasLimit: 200,
        fee: params.feeRate * 200, // 200 bytes vsize
        feeRate: params.feeRate,
        to: params.to,
        inputs: [],
        outputs: [],
      },
    },
  };

  const batchApprovalParams: MultiApprovalParamsWithContext = {
    request: {
      chainId: chainIdToCaip(cChain.chainId),
      method: RpcMethod.ETH_SEND_TRANSACTION_BATCH,
      requestId: 'requestId',
      sessionId: 'sessionId',
      dappInfo,
      context: {
        tabId: 1234,
      },
      params: [
        { from: '0x1', to: '0x2', data: '0xA' },
        { from: '0x1', to: '0x3', value: '0xB' },
      ],
    },
    displayData: {
      details: [
        {
          title: 'Transaction Details',
          items: [
            {
              label: 'From',
              type: DetailItemType.ADDRESS,
              value: params.from,
            },
          ],
        },
      ],
      network: cChain,
      title: 'Approve 2 Transactions',
      networkFeeSelector: true,
    },
    updateTx: jest.fn(),
    signingRequests: [
      {
        displayData: {
          details: [],
          network: cChain,
          title: 'Token Spend Approval',
        },
        signingData: {
          account: params.from,
          type: RpcMethod.ETH_SEND_TRANSACTION,
          data: {
            from: '0x1',
            to: '0x2',
            data: '0xA',
          },
        },
      },
      {
        displayData: {
          details: [],
          network: cChain,
          title: 'Approve Transaction',
        },
        signingData: {
          account: params.from,
          type: RpcMethod.ETH_SEND_TRANSACTION,
          data: {
            from: '0x1',
            to: '0x3',
            value: '0xB',
          },
        },
      },
    ],
  };

  const provider = {} as any;
  const btcTx = {
    inputs: [],
    outputs: [],
    fee: params.feeRate * 200,
  };

  let walletService: jest.Mocked<WalletService>;
  let networkService: jest.Mocked<NetworkService>;
  let secretsService: jest.Mocked<SecretsService>;
  let transactionStatusEvents: jest.Mocked<TransactionStatusEvents>;
  let controller: ApprovalController;

  beforeEach(() => {
    walletService = {
      sign: jest.fn(),
      signTransactionBatch: jest.fn(),
    } as any;

    networkService = {
      getNetwork: jest.fn(),
    } as any;

    secretsService = {
      derivePublicKey: jest.fn(),
    } as any;

    transactionStatusEvents = {
      emitPending: jest.fn(),
      emitConfirmed: jest.fn(),
      emitReverted: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    } as any;

    controller = new ApprovalController(
      secretsService,
      walletService,
      networkService,
      transactionStatusEvents,
    );

    jest.mocked(networkService.getNetwork).mockResolvedValue(btcNetwork);
    jest.mocked(getProviderForNetwork).mockReturnValue(provider);
    jest.mocked(openApprovalWindow).mockImplementation(async (action) => ({
      ...action,
      actionId,
    }));
  });

  describe('requestPublicKey()', () => {
    it('passes the request down to the SecretsService', async () => {
      controller.requestPublicKey({
        curve: 'ed25519',
        derivationPath: 'm/44/1234/0/0',
        secretId: 'secretId',
      });

      expect(secretsService.derivePublicKey).toHaveBeenCalledWith(
        'secretId',
        'ed25519',
        'm/44/1234/0/0',
      );
    });
  });

  describe('updateTx()', () => {
    it('uses `updateTx` callback to update the transaction payload', async () => {
      const updateTx = jest.fn().mockImplementation(({ maxFeeRate }) => ({
        ...approvalParams.signingData,
        data: {
          ...approvalParams.signingData,
          feeRate: Number(maxFeeRate),
        },
      }));

      controller.requestApproval({
        ...approvalParams,
        updateTx,
      });

      await new Promise(process.nextTick);

      const result = controller.updateTx({ actionId } as Action, {
        maxFeeRate: 150n,
      });

      expect(updateTx).toHaveBeenCalledWith({ maxFeeRate: 150n });

      expect(result).toEqual({
        ...approvalParams.signingData,
        data: { ...approvalParams.signingData, feeRate: 150 },
      });
    });
  });

  describe('updateTxInBatch()', () => {
    it('uses `updateTxs` callback to update the transaction payloads', async () => {
      const updateTx = jest
        .fn()
        .mockImplementation(({ maxFeeRate, maxTipRate }, index) => ({
          displayData: batchApprovalParams.displayData,
          signingRequests: batchApprovalParams.signingRequests.map((req, i) =>
            i === index
              ? {
                  ...req,
                  signingData: {
                    ...req.signingData,
                    data: {
                      ...req.signingData.data,
                      maxFeePerGas: maxFeeRate,
                      maxPriorityFeePerGas: maxTipRate,
                    },
                  },
                }
              : req,
          ),
        }));

      controller.requestBatchApproval({
        ...batchApprovalParams,
        updateTx,
      });

      await new Promise(process.nextTick);

      const result = controller.updateTxInBatch(
        { actionId } as MultiTxAction,
        {
          maxFeeRate: 150n,
          maxTipRate: 50n,
        },
        0,
      );

      expect(updateTx).toHaveBeenCalledWith(
        {
          maxFeeRate: 150n,
          maxTipRate: 50n,
        },
        0,
      );

      expect(result).toEqual({
        displayData: batchApprovalParams.displayData,
        signingRequests: batchApprovalParams.signingRequests.map((req, i) =>
          i === 0
            ? {
                ...req,
                signingData: {
                  ...req.signingData,
                  data: {
                    ...req.signingData.data,
                    maxFeePerGas: 150n,
                    maxPriorityFeePerGas: 50n,
                  },
                },
              }
            : req,
        ),
      });
    });
  });

  describe('requestApproval()', () => {
    it('returns error if network cannot be resolved', async () => {
      jest.mocked(networkService.getNetwork).mockResolvedValueOnce(undefined);
      expect(
        await controller.requestApproval({
          request: {
            chainId: 'abcd-1234',
          },
        } as any),
      ).toEqual({
        error: expect.objectContaining({ message: 'Unsupported network' }),
      });
    });

    describe(`after approval`, () => {
      it('opens the generic approval screen', async () => {
        controller.requestApproval(approvalParams);

        await new Promise(process.nextTick);

        expect(openApprovalWindow).toHaveBeenCalledWith(
          {
            ...getExpectedAction(approvalParams),
            type: ActionType.Single,
          },
          'approve/generic',
        );
      });

      it('returns error when user cancels the transaction', async () => {
        const promise = controller.requestApproval(approvalParams);

        await new Promise(process.nextTick);

        const action: Action = {
          ...getExpectedAction(approvalParams),
          type: ActionType.Single,
          actionId: crypto.randomUUID(),
        };

        controller.onRejected(action);

        expect(await promise).toEqual({
          error: providerErrors.userRejectedRequest(),
        });
      });

      it('returns error if transaction cannot be signed', async () => {
        const signingError = new Error('Invalid transaction payload');
        walletService.sign.mockRejectedValueOnce(signingError);

        const promise = controller.requestApproval(approvalParams);
        const action: Action = {
          ...getExpectedAction(approvalParams),
          type: ActionType.Single,
          actionId: crypto.randomUUID(),
        };

        // Await network resolution
        await new Promise(process.nextTick);

        controller.onApproved(action);

        // Wait for transaction to be constructed
        await new Promise(process.nextTick);

        expect(walletService.sign).toHaveBeenCalledWith(
          expect.objectContaining({
            inputs: btcTx.inputs,
            outputs: btcTx.outputs,
          }),
          btcNetwork,
          action.tabId,
        );

        expect(await promise).toEqual({
          error: rpcErrors.internal({
            message: 'Unable to sign the message',
            data: {
              originalError: signingError,
            },
          }),
        });
      });

      it('signs the transaction on user approval', async () => {
        const signedTx = '0x1234';

        walletService.sign.mockResolvedValueOnce({
          signedTx,
        });

        const promise = controller.requestApproval(approvalParams);
        const action: Action = {
          ...getExpectedAction(approvalParams),
          type: ActionType.Single,
          actionId: crypto.randomUUID(),
        };

        // Await network resolution
        await new Promise(process.nextTick);

        controller.onApproved(action);

        // Wait for transaction to be constructed
        await new Promise(process.nextTick);

        expect(walletService.sign).toHaveBeenCalledWith(
          expect.objectContaining({
            inputs: btcTx.inputs,
            outputs: btcTx.outputs,
          }),
          btcNetwork,
          action.tabId,
        );

        expect(await promise).toEqual({ signedData: signedTx });
      });
    });
  });

  describe('requestBatchApproval()', () => {
    it('returns error if network cannot be resolved', async () => {
      jest.mocked(networkService.getNetwork).mockResolvedValueOnce(undefined);
      expect(
        await controller.requestBatchApproval({
          request: {
            chainId: 'abcd-1234',
          },
        } as any),
      ).toEqual({
        error: expect.objectContaining({ message: 'Unsupported network' }),
      });
    });

    describe(`after approval`, () => {
      beforeEach(() => {
        jest.mocked(networkService.getNetwork).mockResolvedValue(cChain);
      });

      it('opens the batch approval screen', async () => {
        controller.requestBatchApproval(batchApprovalParams);

        await new Promise(process.nextTick);

        expect(openApprovalWindow).toHaveBeenCalledWith(
          {
            ...getExpectedAction(batchApprovalParams),
            type: ActionType.Batch,
          },
          'approve/tx-batch',
        );
      });

      it('returns error when user cancels the transaction', async () => {
        const promise = controller.requestBatchApproval(batchApprovalParams);

        await new Promise(process.nextTick);

        const action: MultiTxAction = {
          ...getExpectedAction(batchApprovalParams),
          type: ActionType.Batch,
          actionId: crypto.randomUUID(),
        };

        controller.onRejected(action);

        expect(await promise).toEqual({
          error: providerErrors.userRejectedRequest(),
        });
      });

      it('returns error if transaction cannot be signed', async () => {
        const signingError = new Error('Invalid transaction payload');
        walletService.signTransactionBatch.mockRejectedValueOnce(signingError);

        const promise = controller.requestBatchApproval(batchApprovalParams);
        const action: MultiTxAction = {
          ...getExpectedAction(batchApprovalParams),
          type: ActionType.Batch,
          actionId: crypto.randomUUID(),
        };

        // Await network resolution
        await new Promise(process.nextTick);

        controller.onApproved(action);

        // Wait for transaction to be constructed
        await new Promise(process.nextTick);

        expect(walletService.signTransactionBatch).toHaveBeenCalledWith(
          batchApprovalParams.signingRequests.map(
            (req) => req.signingData.data,
          ),
          cChain,
          action.tabId,
        );

        expect(await promise).toEqual({
          error: rpcErrors.internal({
            message: 'Unable to sign the batch of transactions',
            data: {
              originalError: signingError,
            },
          }),
        });
      });

      it('signs the transaction on user approval', async () => {
        const signedTxA = '0x1234';
        const signedTxB = '0x5678';

        walletService.signTransactionBatch.mockResolvedValueOnce([
          {
            signedTx: signedTxA,
          },
          {
            signedTx: signedTxB,
          },
        ]);

        const promise = controller.requestBatchApproval(batchApprovalParams);
        const action: MultiTxAction = {
          ...getExpectedAction(batchApprovalParams),
          type: ActionType.Batch,
          actionId: crypto.randomUUID(),
        };

        // Await network resolution
        await new Promise(process.nextTick);

        controller.onApproved(action);

        // Wait for transaction to be constructed
        await new Promise(process.nextTick);

        expect(walletService.signTransactionBatch).toHaveBeenCalledWith(
          batchApprovalParams.signingRequests.map(
            (req) => req.signingData.data,
          ),
          cChain,
          action.tabId,
        );

        expect(await promise).toEqual({
          result: [{ signedData: signedTxA }, { signedData: signedTxB }],
        });
      });
    });
  });
});
