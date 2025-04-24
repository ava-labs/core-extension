import { ExtensionRequest } from '@core/types/src/models';
import { UpdateActionTxDataHandler } from './updateTxData';
import { matchingPayload } from '@src/tests/test-utils';
import { SendErrorMessage } from 'packages/utils/src/send/models';
import { HandlerParameters } from 'packages/service-worker/src/connections/models';

describe('src/background/services/actions/handlers/updateTxData', () => {
  const actionsService = {
    getActions: jest.fn(),
    updateTx: jest.fn(),
  };

  const handleRequest = async (request) => {
    const handler = new UpdateActionTxDataHandler(actionsService as any);

    return handler.handle(request);
  };

  const getRequest = (
    params: HandlerParameters<UpdateActionTxDataHandler>,
  ) => ({
    request: {
      id: '1234',
      method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
      params,
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('remaps BTC tx transaction error to insufficient balance for fee', async () => {
    jest.mocked(actionsService.getActions).mockResolvedValue({
      id: {},
    });
    jest
      .mocked(actionsService.updateTx)
      .mockRejectedValueOnce({ message: 'Unable to create transaction' });

    expect(await handleRequest(getRequest(['id', { feeRate: 5 }]))).toEqual(
      matchingPayload({ error: SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE }),
    );
  });

  it('validates the request to update exists', async () => {
    expect(await handleRequest(getRequest(['id', { feeRate: 5 }]))).toEqual(
      matchingPayload({ error: 'no pending requests found' }),
    );
  });

  it('calls ActionsService.updateTx()', async () => {
    jest.mocked(actionsService.getActions).mockResolvedValue({
      id: {},
    });

    await handleRequest(getRequest(['id', { feeRate: 5 }]));
    expect(actionsService.updateTx).toHaveBeenCalledWith(
      'id',
      { feeRate: 5 },
      undefined,
    );
  });

  it('passes the tx index for batch signing requests', async () => {
    jest.mocked(actionsService.getActions).mockResolvedValue({
      id: {},
    });

    await handleRequest(getRequest(['id', { maxFeeRate: 5n }, 3]));
    expect(actionsService.updateTx).toHaveBeenCalledWith(
      'id',
      { maxFeeRate: 5n },
      3,
    );
  });
});
