import { Avalanche } from '@avalabs/wallets-sdk';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheGetAddressesInRangeHandler } from './avalanche_getAddressesInRange';

jest.mock('@avalabs/wallets-sdk');

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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('returns error on error', async () => {
      const error = new Error('some error');
      getPrimaryAccountSecretsMock.mockRejectedValueOnce(error);
      const request = {
        id: '123',
        method: DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE,
        params: [0, 0, 10, 10],
      } as any;

      const result = await handleRequest(request);
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
        const { error } = await handleRequest({ params: [-1, 0] });

        expect(error).toEqual(
          ethErrors.rpc.invalidParams({
            message: 'Invalid start index',
          })
        );
      });

      it('throws if internal start index is incorrect', async () => {
        const { error } = await handleRequest({ params: [0, -1] });
        expect(error).toEqual(
          ethErrors.rpc.invalidParams({
            message: 'Invalid start index',
          })
        );
      });

      it('returns the address list correctly', async () => {
        const { result } = await handleRequest({ params: [0, 0, 2, 2] });
        expect(result).toEqual({
          external: getExpectedResult('external', 2),
          internal: getExpectedResult('internal', 2),
        });
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(4);
      });

      it('sets the limit to 0 if not provided', async () => {
        const { result } = await handleRequest({ params: [0, 0] });
        expect(result).toStrictEqual({
          external: [],
          internal: [],
        });
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(0);
      });

      it('sets the limit to 100 if the provided is over 100', async () => {
        const { result } = await handleRequest({ params: [0, 0, 1000, 1000] });
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
    const request = {
      id: '123',
      method: DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE,
      params: [0, 0, 10, 10],
    } as any;

    const result = await handler.handleUnauthenticated(request);
    expect(result).toEqual({
      ...request,
      error: ethErrors.provider.unauthorized(),
    });
  });
});
