import { ExtensionRequest } from '@core/types';
import { AppCheckService } from '../../appcheck/AppCheckService';
import { SetGaslessHexValues } from './setHexValues';
import { GasStationService } from '../GasStationService';
import { buildRpcCall } from '@shared/tests/test-utils';

describe('src/background/services/gasless/handlers/setHexValues', () => {
  let handler: SetGaslessHexValues;
  const appCheckMock = jest.mocked<AppCheckService>({
    getAppcheckToken: jest.fn().mockResolvedValue({ token: 'appCheckToken' }),
  } as any);
  const request = {
    method: ExtensionRequest.GASLESS_SET_HEX_VALUES,
    id: '1234',
    params: {
      challengeHex: 'challengeHex',
      solutionHex: 'solutionHex',
      pipelineIndex: 0,
    },
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
    gasStationServiceMock.setHexValuesAndFund = jest.fn();
    handler = new SetGaslessHexValues(gasStationServiceMock);
  });
  it('should call the service `setDefaultStateValues` function with the right params', () => {
    handler.handle(buildRpcCall(request) as any);
    expect(gasStationServiceMock.setHexValuesAndFund).toHaveBeenCalledWith({
      challengeHex: 'challengeHex',
      solutionHex: 'solutionHex',
      pipelineIndex: 0,
    });
  });
});
