import { ExtensionRequest } from '@core/types/src/models';
import { DefiService } from '../DefiService';
import { GetDefiPortfolioHandler } from './getDefiPortfolio';
import { DefiProtocol } from '@core/types/src/models';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/defi/handlers/getDefiPortfolio.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defiService = {
    getUserPortfolio: jest.fn(),
  } as unknown as DefiService;

  it(`fetches user's defi portfolio`, async () => {
    const mockedPortfolio = {
      protocols: [{ id: 'aave3', totalUsdValue: 1 }] as DefiProtocol[],
      totalUsdValue: 1,
    };

    jest
      .mocked(defiService.getUserPortfolio)
      .mockResolvedValueOnce(mockedPortfolio);

    const handler = new GetDefiPortfolioHandler(defiService);

    const response = await handler.handle(
      buildRpcCall({
        id: '1',
        params: ['0x1234'],
        method: ExtensionRequest.DEFI_GET_PORTFOLIO,
      }),
    );

    expect(response).toEqual({
      id: '1',
      method: ExtensionRequest.DEFI_GET_PORTFOLIO,
      params: ['0x1234'],
      result: mockedPortfolio,
    });
  });

  describe('when defi service fails to provide data', () => {
    beforeEach(() => {
      jest
        .mocked(defiService.getUserPortfolio)
        .mockRejectedValueOnce(new Error('DefiService: I failed, sorry'));
    });

    it('responds with proper error', async () => {
      const handler = new GetDefiPortfolioHandler(defiService);

      const response = await handler.handle(
        buildRpcCall({
          id: '1',
          params: ['0x1234'],
          method: ExtensionRequest.DEFI_GET_PORTFOLIO,
        }),
      );

      expect(response).toEqual({
        id: '1',
        method: ExtensionRequest.DEFI_GET_PORTFOLIO,
        params: ['0x1234'],
        error: 'DefiService: I failed, sorry',
      });
    });
  });
});
