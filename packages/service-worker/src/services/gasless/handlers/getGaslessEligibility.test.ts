import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';
import { AppCheckService } from '../../appcheck/AppCheckService';
import { GetGaslessEligibilityHandler } from './getGaslessEligibility';
import { GasStationService } from '../GasStationService';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/gasless/handlers/getGaslessEligibility', () => {
  let handler: GetGaslessEligibilityHandler;
  const appCheckMock = jest.mocked<AppCheckService>({
    getAppcheckToken: jest.fn().mockResolvedValue({ token: 'appCheckToken' }),
  } as any);
  const request = {
    method: ExtensionRequest.GASLESS_GET_ELIGIBILITY,
    id: '1234',
    params: [1, 'fromAddress', 'nonce'],
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
    gasStationServiceMock.getEligibility = jest.fn();
    handler = new GetGaslessEligibilityHandler(gasStationServiceMock);
  });
  it('should call the service `getEligibility` function with the right params', () => {
    handler.handle(buildRpcCall(request) as any);
    expect(gasStationServiceMock.getEligibility).toHaveBeenCalledWith({
      chainId: '1',
      fromAddress: 'fromAddress',
      nonce: 'nonce',
    });
  });
});
