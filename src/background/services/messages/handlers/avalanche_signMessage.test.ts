import { AvalancheSignMessageHandler } from '@src/background/services/messages/handlers/avalanche_signMessage';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { Action } from '@src/background/services/actions/models';
import { utils } from '@avalabs/avalanchejs';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { buildRpcCall } from '@src/tests/test-utils';
import { ChainId } from '@avalabs/core-chains-sdk';

jest.mock('@avalabs/avalanchejs');
jest.mock('@src/background/runtime/openApprovalWindow');

describe('avalanche_signMessage', function () {
  const msg = 'test';
  const msgHex = '74657374';
  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_SIGN_MESSAGE,
    params: [msg], // test
    site: {
      tabId: 1,
    } as any,
  };

  const signMessageMock = jest.fn();
  const onSuccessMock = jest.fn();
  const onErrorMock = jest.fn();

  const walletServiceMock = {
    signMessage: signMessageMock,
  };

  beforeEach(() => {
    jest.mocked(openApprovalWindow).mockResolvedValue({} as any);
  });

  it('returns error when no message', async () => {
    const handler = new AvalancheSignMessageHandler(walletServiceMock as any);
    const res = await handler.handleAuthenticated(
      buildRpcCall({ ...request, params: [] }),
    );

    expect(res).toHaveProperty('error');
    expect(res.error.message).toMatch('Missing mandatory param');
  });

  it('returns error when account index is not valid', async () => {
    const handler = new AvalancheSignMessageHandler(walletServiceMock as any);
    const res = await handler.handleAuthenticated(
      buildRpcCall({
        ...request,
        params: ['hello', 'accountIndex'],
      }),
    );

    expect(res).toHaveProperty('error');
    expect(res.error.message).toMatch(
      'Invalid account index provided: accountIndex',
    );
  });

  it('passes the right display data', async () => {
    const handler = new AvalancheSignMessageHandler(walletServiceMock as any);
    const scope = `eip:${ChainId.AVALANCHE_TEST_P}`;

    await handler.handleAuthenticated(buildRpcCall(request, scope));

    expect(openApprovalWindow).toHaveBeenCalledWith(
      {
        ...request,
        scope,
        displayData: {
          messageParams: {
            accountIndex: undefined,
            data: msgHex,
            from: '',
          },
          isMessageValid: true,
          validationError: undefined,
        },
      },
      'sign',
    );
  });

  it('passes the right display data', async () => {
    const handler = new AvalancheSignMessageHandler(walletServiceMock as any);

    const requestWithAccountIndex = {
      id: '456',
      method: DAppProviderRequest.AVALANCHE_SIGN_MESSAGE,
      params: [msg, 2], // test
      site: {
        tabId: 1,
      } as any,
    };

    await handler.handleAuthenticated(buildRpcCall(requestWithAccountIndex));

    expect(openApprovalWindow).toHaveBeenCalledWith(
      {
        ...requestWithAccountIndex,
        scope: 'eip155:43113',
        displayData: {
          messageParams: {
            data: msgHex,
            from: '',
            accountIndex: 2,
          },
          isMessageValid: true,
          validationError: undefined,
        },
      },
      'sign',
    );
  });

  describe('on approved', () => {
    const pendingActionMock = {
      displayData: {
        messageParams: {
          data: msgHex,
          from: '',
        },
        isMessageValid: true,
        validationError: undefined,
      },
      request: {
        params: {},
      },
    } as unknown as Action;

    it('throws when signing fails', async () => {
      const handler = new AvalancheSignMessageHandler(walletServiceMock as any);

      signMessageMock.mockReturnValue(undefined);

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
      );

      expect(onErrorMock).toBeCalled();
    });

    it('calls success with right value', async () => {
      const handler = new AvalancheSignMessageHandler(walletServiceMock as any);

      (utils.base58check.encode as jest.Mock).mockReturnValue('encoded');
      signMessageMock.mockReturnValue(Buffer.from(msgHex));

      await handler.onActionApproved(
        pendingActionMock,
        {},
        onSuccessMock,
        onErrorMock,
      );

      expect(onSuccessMock).toBeCalledWith('encoded');
    });
  });
});
