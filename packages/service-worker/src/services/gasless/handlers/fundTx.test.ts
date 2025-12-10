import { ExtensionRequest } from '@core/types';
import { AppCheckService } from '../../appcheck/AppCheckService';
import { GasStationService } from '../GasStationService';
import { buildRpcCall } from '@shared/tests/test-utils';
import { FundTxHandler } from './fundTx';

describe('src/background/services/gasless/handlers/fundTx', () => {
  let handler: FundTxHandler;
  const appCheckMock = jest.mocked<AppCheckService>({
    getAppcheckToken: jest.fn().mockResolvedValue({ token: 'appCheckToken' }),
  } as any);
  const request = {
    method: ExtensionRequest.GASLESS_FUND_TX,
    id: '1234',
    params: ['data', 'challengeHex', 'solutionHex', 'fromAddress'],
  };
  const realEnv = process.env;
  let gasStationServiceMock;
  beforeEach(() => {
    process.env = {
      ...realEnv,
      GASLESS_SERVICE_URL: 'https://core-gas-station.avax-test.network',
    };
    gasStationServiceMock = new GasStationService(
      appCheckMock,
      {} as any,
      {} as any,
    );
    gasStationServiceMock.fundTx = jest.fn();
    handler = new FundTxHandler(gasStationServiceMock);
  });
  it('should call the service `fundTx` function with the right params', () => {
    handler.handle(buildRpcCall(request) as any);
    expect(gasStationServiceMock.fundTx).toHaveBeenCalledWith({
      data: 'data',
      challengeHex: 'challengeHex',
      solutionHex: 'solutionHex',
      fromAddress: 'fromAddress',
    });
  });

  it('Should return the error message if the fund request returns UNAUTHORIZED', async () => {
    gasStationServiceMock.fundTx.mockReturnValue({
      message: 'UNAUTHORIZED',
    });

    const response = await handler.handle(buildRpcCall(request) as any);

    expect(response).toEqual(
      expect.objectContaining({
        error: 'Error: Gasless funding unauthorized',
      }),
    );
  });
});
