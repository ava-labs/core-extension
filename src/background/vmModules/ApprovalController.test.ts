import { ChainId } from '@avalabs/core-chains-sdk';
import { errorCodes, providerErrors, rpcErrors } from '@metamask/rpc-errors';
import { DappInfo, DetailItemType, RpcMethod } from '@avalabs/vm-module-types';
import { BitcoinSendTransactionParams } from '@avalabs/bitcoin-module';

import { buildBtcTx } from '@src/utils/send/btcSendUtils';
import { chainIdToCaip } from '@src/utils/caipConversion';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

import { WalletService } from '../services/wallet/WalletService';
import { NetworkService } from '../services/network/NetworkService';
import { openApprovalWindow } from '../runtime/openApprovalWindow';

import { ApprovalParamsWithContext } from './models';
import { buildBtcSendTransactionAction } from './helpers/buildBtcSendTransactionAction';
import { ApprovalController } from './ApprovalController';

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
jest.mock('@src/utils/send/btcSendUtils');

const btcNetwork = {
  chainId: ChainId.BITCOIN_TESTNET,
  rpcUrl: '',
} as any;

const dappInfo: DappInfo = {
  icon: 'icon',
  name: 'name',
  url: 'https://extension.url',
};

describe('src/background/vmModules/ApprovalController', () => {
  describe('requestApproval()', () => {
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
    });

    it('returns error if network cannot be resolved', async () => {
      expect(
        await controller.requestApproval({
          request: {
            chainId: 'abcd-1234',
          },
        } as any)
      ).toEqual({
        error: expect.objectContaining({ message: 'Unsupported network' }),
      });
    });

    it('returns error if request method is unknown', async () => {
      networkService.getNetwork.mockResolvedValue(btcNetwork);

      expect(
        await controller.requestApproval({
          request: {
            chainId: btcNetwork.chainId,
            method: 'weird-method',
          },
        } as any)
      ).toEqual({
        error: expect.objectContaining({
          code: errorCodes.rpc.methodNotSupported,
        }),
      });
    });

    it('returns error if signing data is of unknown format', async () => {
      networkService.getNetwork.mockResolvedValue(btcNetwork);

      expect(
        await controller.requestApproval({
          request: {
            chainId: btcNetwork.chainId,
            method: RpcMethod.BITCOIN_SEND_TRANSACTION,
          },
          signingData: {
            type: 'weird-format',
          },
        } as any)
      ).toEqual({
        error: expect.objectContaining({
          code: errorCodes.rpc.methodNotSupported,
        }),
      });
    });

    describe(`with ${RpcMethod.BITCOIN_SEND_TRANSACTION} request`, () => {
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

      beforeEach(() => {
        jest.mocked(networkService.getNetwork).mockResolvedValue(btcNetwork);
        jest.mocked(getProviderForNetwork).mockReturnValue(provider);
        jest.mocked(buildBtcTx).mockResolvedValue(btcTx);
        jest.mocked(openApprovalWindow).mockImplementation(async (action) => ({
          ...action,
          actionId: crypto.randomUUID(),
        }));
      });

      it('opens the BitcoinSignTx approval screen', async () => {
        controller.requestApproval(approvalParams);

        await new Promise(process.nextTick);

        expect(openApprovalWindow).toHaveBeenCalledWith(
          buildBtcSendTransactionAction(approvalParams),
          'approve/bitcoinSignTx'
        );
      });

      it('returns error when user cancels the transaction', async () => {
        const promise = controller.requestApproval(approvalParams);

        await new Promise(process.nextTick);

        const action = {
          ...buildBtcSendTransactionAction(approvalParams),
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
          ...buildBtcSendTransactionAction(approvalParams),
          actionId: crypto.randomUUID(),
        };

        // Await network resolution
        await new Promise(process.nextTick);

        controller.onApproved(action);

        // Wait for transaction to be constructed
        await new Promise(process.nextTick);

        expect(walletService.sign).toHaveBeenCalledWith(
          {
            inputs: btcTx.inputs,
            outputs: btcTx.outputs,
          },
          btcNetwork
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
          ...buildBtcSendTransactionAction(approvalParams),
          actionId: crypto.randomUUID(),
        };

        // Await network resolution
        await new Promise(process.nextTick);

        controller.onApproved(action);

        const signingData = action.signingData as any;

        expect(buildBtcTx).toHaveBeenCalledWith(signingData.account, provider, {
          amount: signingData.data.amount,
          address: signingData.data.to,
          feeRate: signingData.data.feeRate,
          token: signingData.data.balance,
        });

        // Wait for transaction to be constructed
        await new Promise(process.nextTick);

        expect(walletService.sign).toHaveBeenCalledWith(
          {
            inputs: btcTx.inputs,
            outputs: btcTx.outputs,
          },
          btcNetwork
        );

        expect(await promise).toEqual({ signedData: signedTx });
      });
    });
  });
});
