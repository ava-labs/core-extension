import { ExtensionRequest } from '@core/types/src/models';
import { GasStationService } from '../GasStationService';
import { FetchAndSolveChallengeHandler } from './fetchAndSolveChallenge';
import { buildRpcCall } from '@src/tests/test-utils';
import { AppCheckService } from '../../appcheck/AppCheckService';

describe('src/background/services/gasless/handlers/fetchAndSolveChallenge', () => {
  let handler: FetchAndSolveChallengeHandler;
  const appCheckMock = jest.mocked<AppCheckService>({
    getAppcheckToken: jest.fn().mockResolvedValue({ token: 'appCheckToken' }),
  } as any);
  const request = {
    method: ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE,
    id: '1234',
    params: [],
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
    gasStationServiceMock.fetchAndSolveChallange = jest.fn();
    handler = new FetchAndSolveChallengeHandler(gasStationServiceMock);
  });
  it('should call the service `fetchAndSolveChallange` function', () => {
    handler.handle(buildRpcCall(request) as any);
    expect(gasStationServiceMock.fetchAndSolveChallange).toHaveBeenCalled();
  });
});
