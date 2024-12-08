import { ChainId } from '@avalabs/core-chains-sdk';
import { providerErrors, rpcErrors } from '@metamask/rpc-errors';
import { DappInfo, DetailItemType, RpcMethod } from '@avalabs/vm-module-types';
import { BitcoinSendTransactionParams } from '@avalabs/bitcoin-module';

import { chainIdToCaip } from '@src/utils/caipConversion';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

import { WalletService } from '../services/wallet/WalletService';
import { NetworkService } from '../services/network/NetworkService';
import { openApprovalWindow } from '../runtime/openApprovalWindow';

import { ApprovalParamsWithContext } from './models';
import { ApprovalController } from './ApprovalController';
import { ACTION_HANDLED_BY_MODULE } from '../models';
import { ActionStatus } from '../services/actions/models';

jest.mock('tsyringe', () => {
  return {
    ...jest.requireActual('tsyringe'),
    container: {
      resolve: jest.fn(),
    },
  };
});
jest.mock('../runtime/openApprovalWindow');
jest.mock('@src/utils/network/getProviderForNetwork');

const btcNetwork = {
  chainId: ChainId.BITCOIN_TESTNET,
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
  dappInfo: params.request.dappInfo,
  signingData: params.signingData,
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

  const provider = {} as any;
  const btcTx = {
    inputs: [],
    outputs: [],
    fee: params.feeRate * 200,
  };

  let walletService: jest.Mocked<WalletService>;
  let networkService: jest.Mocked<NetworkService>;
  let controller: ApprovalController;

  beforeEach(() => {
    walletService = {
      sign: jest.fn(),
    } as any;

    networkService = {
      getNetwork: jest.fn(),
    } as any;

    controller = new ApprovalController(walletService, networkService);

    jest.mocked(networkService.getNetwork).mockResolvedValue(btcNetwork);
    jest.mocked(getProviderForNetwork).mockReturnValue(provider);
    jest.mocked(openApprovalWindow).mockImplementation(async (action) => ({
      ...action,
      actionId,
    }));
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

      const result = controller.updateTx(actionId, {
        maxFeeRate: 150n,
      });

      expect(updateTx).toHaveBeenCalledWith({ maxFeeRate: 150n });

      expect(result).toEqual({
        ...approvalParams.signingData,
        data: { ...approvalParams.signingData, feeRate: 150 },
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
          getExpectedAction(approvalParams),
          'approve/generic',
        );
      });

      it('returns error when user cancels the transaction', async () => {
        const promise = controller.requestApproval(approvalParams);

        await new Promise(process.nextTick);

        const action = {
          ...getExpectedAction(approvalParams),
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
        const action = {
          ...getExpectedAction(approvalParams),
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
        const action = {
          ...getExpectedAction(approvalParams),
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
});
