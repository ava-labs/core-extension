import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheGetAddressesInRangeHandler } from './avalanche_getAddressesInRange';

describe('background/services/accounts/handlers/avalanche_getAddressesInRange.ts', () => {
  const getAddressesInRangeMock = jest.fn();

  const walletServiceMock = {
    getAddressesInRange: getAddressesInRangeMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('returns error on error', async () => {
      const error = new Error('some error');
      getAddressesInRangeMock.mockRejectedValueOnce(error);
      const handler = new AvalancheGetAddressesInRangeHandler(
        walletServiceMock
      );
      const request = {
        id: '123',
        method: DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE,
        params: [0, 0, 10, 10],
      } as any;

      const result = await handler.handleAuthenticated(request);
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: error.message,
        }),
      });
    });

    it('returns the address list', async () => {
      const addressList = {
        external: ['address0', 'address1'],
        internal: ['address3', 'address4'],
      };
      getAddressesInRangeMock.mockResolvedValueOnce(addressList);

      const handler = new AvalancheGetAddressesInRangeHandler(
        walletServiceMock
      );
      const request = {
        id: '123',
        method: DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE,
        params: [0, 0, 10, 10],
      } as any;

      const result = await handler.handleAuthenticated(request);
      expect(result).toEqual({ ...request, result: addressList });
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheGetAddressesInRangeHandler(walletServiceMock);
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
