import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { AppCheckService } from '../../appcheck/AppCheckService';
import { SetDefaultStateValuesHandler } from './setDefaultStateValues';
import { GasStationService } from '../GasStationService';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/gasless/handlers/setDefaultValues', () => {
  let handler: SetDefaultStateValuesHandler;
  const appCheckMock = jest.mocked<AppCheckService>({
    getAppcheckToken: jest.fn().mockResolvedValue({ token: 'appCheckToken' }),
  } as any);
  const request = {
    method: ExtensionRequest.GASLESS_GET_ELIGIBILITY,
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
    gasStationServiceMock.setDefaultStateValues = jest.fn();
    handler = new SetDefaultStateValuesHandler(gasStationServiceMock);
  });
  it('should call the service `setDefaultStateValues` function', () => {
    handler.handle(buildRpcCall(request) as any);
    expect(gasStationServiceMock.setDefaultStateValues).toHaveBeenCalled();
  });
});
