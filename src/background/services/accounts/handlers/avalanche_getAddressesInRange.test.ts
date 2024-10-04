import { Avalanche } from '@avalabs/core-wallets-sdk';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheGetAddressesInRangeHandler } from './avalanche_getAddressesInRange';
import { buildRpcCall } from '@src/tests/test-utils';
import { canSkipApproval } from '@src/utils/canSkipApproval';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('@src/utils/canSkipApproval');
jest.mock('@src/background/runtime/openApprovalWindow');

describe('background/services/accounts/handlers/avalanche_getAddressesInRange.ts', () => {
  const getPrimaryAccountSecretsMock = jest.fn();

  const secretsServiceMock = {
    getPrimaryAccountSecrets: getPrimaryAccountSecretsMock,
  } as any;

  const networkServiceMock = {
    getAvalanceProviderXP: jest.fn(),
  } as any;

  const handleRequest = async (request) => {
    const handler = new AvalancheGetAddressesInRangeHandler(
      secretsServiceMock,
      networkServiceMock
    );

    return handler.handleAuthenticated(request);
  };

  const getPayload = (payload) =>
    ({
      id: '1234',
      method: DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE,
      site: {
        domain: 'core.app',
        tabId: 3,
      },
      ...payload,
    } as const);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(canSkipApproval).mockResolvedValue(true);
  });

  describe('handleAuthenticated', () => {
    it('returns error on error', async () => {
      const error = new Error('some error');
      getPrimaryAccountSecretsMock.mockRejectedValueOnce(error);
      const request = getPayload({
        params: [0, 0, 10, 10],
      });

      const result = await handleRequest(buildRpcCall(request));
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: error.message,
        }),
      });
    });

    describe('mnemonic wallet', () => {
      const xpubXP = 'xpubXP';

      const getExpectedResult = (type: string, count: number) =>
        [...Array(count)].map((_, i) => `${type}_address${i}`);

      beforeEach(() => {
        getPrimaryAccountSecretsMock.mockResolvedValue({
          xpubXP,
        });

        jest
          .mocked(Avalanche.getAddressFromXpub)
          .mockImplementation(
            (_, index, __, ___, isChange) =>
              `X-${isChange ? 'internal' : 'external'}_address${index}`
          );
      });

      it('throws if external start index is incorrect', async () => {
        const { error } = await handleRequest(
          buildRpcCall(getPayload({ params: [-1, 0] }))
        );

        expect(error).toEqual(
          ethErrors.rpc.invalidParams({
            message: 'Invalid start index',
          })
        );
      });

      it('throws if internal start index is incorrect', async () => {
        const { error } = await handleRequest(
          buildRpcCall(getPayload({ params: [0, -1] }))
        );
        expect(error).toEqual(
          ethErrors.rpc.invalidParams({
            message: 'Invalid start index',
          })
        );
      });

      it('returns the address list correctly', async () => {
        const { result } = await handleRequest(
          buildRpcCall(getPayload({ params: [0, 0, 2, 2] }))
        );
        expect(result).toEqual({
          external: getExpectedResult('external', 2),
          internal: getExpectedResult('internal', 2),
        });
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(4);
      });

      it('asks for approval for non-Core dApps', async () => {
        jest.mocked(canSkipApproval).mockResolvedValueOnce(false);

        const request = getPayload({ params: [0, 0, 2, 2] });
        const { result } = await handleRequest(buildRpcCall(request));
        expect(result).toEqual(DEFERRED_RESPONSE);
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              indices: {
                internalStart: 0,
                internalLimit: 2,
                externalStart: 0,
                externalLimit: 2,
              },
              addresses: {
                external: getExpectedResult('external', 2),
                internal: getExpectedResult('internal', 2),
              },
            }),
          }),
          'getAddressesInRange'
        );
      });

      it('sets the limit to 0 if not provided', async () => {
        const { result } = await handleRequest(
          buildRpcCall(getPayload({ params: [0, 0] }))
        );
        expect(result).toStrictEqual({
          external: [],
          internal: [],
        });
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(0);
      });

      it('sets the limit to 100 if the provided is over 100', async () => {
        const { result } = await handleRequest(
          buildRpcCall(getPayload({ params: [0, 0, 1000, 1000] }))
        );
        expect(result.external).toHaveLength(100);
        expect(result.internal).toHaveLength(100);
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(200);
      });
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheGetAddressesInRangeHandler(
      secretsServiceMock,
      networkServiceMock
    );
    const request = getPayload({
      params: [0, 0, 10, 10],
    });

    const result = await handler.handleUnauthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: ethErrors.provider.unauthorized(),
    });
  });
});
