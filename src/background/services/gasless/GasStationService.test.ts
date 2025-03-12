import { AppCheckService } from '../appcheck/AppCheckService';
import { NetworkService } from '../network/NetworkService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { GasStationService } from './GasStationService';
import { GaslessSdk } from '@avalabs/core-gasless-sdk';

jest.mock('@avalabs/core-gasless-sdk');
describe('src/background/services/gasless/GasStationService', () => {
  const appCheckService = new AppCheckService({} as any);

  const networkService = new NetworkService({} as any, {} as any);
  const networkFeeService = new NetworkFeeService({} as any);

  const gasStationUrl = 'https://core-gas-station.avax-test.network';
  it('should call the `SDK` with the right `URL`', () => {
    new GasStationService(appCheckService, networkService, networkFeeService);

    expect(GaslessSdk).toHaveBeenLastCalledWith(gasStationUrl);
  });
});
