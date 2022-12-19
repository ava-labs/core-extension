import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SwapSide } from 'paraswap';
import { GetSwapRateHandler } from './getSwapRate';

describe('background/services/swap/handlers/getSwapRate.ts', () => {
  const swapServiceMock = {
    getSwapRate: jest.fn(),
  };

  const getSwapRateHandler = new GetSwapRateHandler(swapServiceMock as any);
  const getRequest = (excludedParam?: string) => {
    const params = {
      srcToken: '0x0000',
      srcDecimals: 10,
      destToken: '0x0001',
      destDecimals: 10,
      srcAmount: 10000,
      swapSide: SwapSide.SELL,
    };

    if (excludedParam) {
      params[excludedParam] = undefined;
    }

    return {
      id: '123',
      method: ExtensionRequest.SWAP_GET_RATE,
      params: Object.values(params),
    } as any;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns error if source token is missing', async () => {
    const request = getRequest('srcToken');

    await expect(getSwapRateHandler.handle(request)).resolves.toStrictEqual({
      ...request,
      error: 'no source token on request',
    });
  });

  it('returns error if destination token is missing', async () => {
    const request = getRequest('destToken');

    await expect(getSwapRateHandler.handle(request)).resolves.toStrictEqual({
      ...request,
      error: 'no destination token on request',
    });
  });

  it('returns error if source amount is missing', async () => {
    const request = getRequest('srcAmount');

    await expect(getSwapRateHandler.handle(request)).resolves.toStrictEqual({
      ...request,
      error: 'no amount on request',
    });
  });

  it('returns error if source decimals are missing', async () => {
    const request = getRequest('srcDecimals');

    await expect(getSwapRateHandler.handle(request)).resolves.toStrictEqual({
      ...request,
      error: 'request requires the decimals for source token',
    });
  });

  it('returns error if source decimals are missing', async () => {
    const request = getRequest('destDecimals');

    await expect(getSwapRateHandler.handle(request)).resolves.toStrictEqual({
      ...request,
      error: 'request requires the decimals for destination token',
    });
  });

  it('returns error if service call fails', async () => {
    const request = getRequest();
    const errorMessage = 'some error';

    swapServiceMock.getSwapRate.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getSwapRateHandler.handle(request)).resolves.toStrictEqual({
      ...request,
      error: `Error: ${errorMessage}`,
    });
    expect(swapServiceMock.getSwapRate).toHaveBeenCalledWith(...request.params);
  });

  it('returns the correct swap rate', async () => {
    const request = getRequest();
    const result = {
      destAmount: 20000,
      blockNumber: 1,
    };

    swapServiceMock.getSwapRate.mockResolvedValueOnce(result);

    await expect(getSwapRateHandler.handle(request)).resolves.toStrictEqual({
      ...request,
      result: {
        optimalRate: result,
        destAmount: result.destAmount,
      },
    });
    expect(swapServiceMock.getSwapRate).toHaveBeenCalledWith(...request.params);
  });
});
