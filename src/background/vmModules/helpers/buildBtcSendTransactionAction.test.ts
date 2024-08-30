import { BitcoinSendTransactionParams } from '@avalabs/bitcoin-module';
import { ChainId } from '@avalabs/core-chains-sdk';
import { DetailItemType, RpcMethod } from '@avalabs/vm-module-types';
import { chainIdToCaip } from '@src/utils/caipConversion';
import { ApprovalParamsWithContext, VIA_MODULE_SYMBOL } from '../models';
import { ActionStatus } from '@src/background/services/actions/models';
import { buildBtcSendTransactionAction } from './buildBtcSendTransactionAction';

describe('src/background/vmModules/helpers/buildBtcSendTransactionAction', () => {
  const btcNetwork = {
    chainId: ChainId.BITCOIN_TESTNET,
    rpcUrl: '',
  } as any;
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
      dappInfo: {
        icon: 'icon',
        name: 'name',
        url: 'https://extension.url',
      },
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

  it('generates valid action', () => {
    expect(buildBtcSendTransactionAction(approvalParams)).toEqual({
      [VIA_MODULE_SYMBOL]: true,
      dappInfo: approvalParams.request.dappInfo,
      signingData: approvalParams.signingData,
      context: approvalParams.request.context,
      status: ActionStatus.PENDING,
      tabId: approvalParams.request.context?.tabId,
      params: approvalParams.request.params,
      displayData: approvalParams.displayData,
      scope: approvalParams.request.chainId,
      id: approvalParams.request.requestId,
      method: approvalParams.request.method,
    });
  });
});
